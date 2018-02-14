// todo: add load from config file, TBD

import path = require('path');

const Listr = require('listr');
const cpy = require('cpy');
const del = require('del');
const fs = require('fs');

import { findSubmodules, tasksWatch } from '../utils';
import { build, bundleUmd, buildPkgs, bundleEs2015 } from '../tasks';
import { inlineResources } from '../helpers/inline-resources';


export function buildCommand({project, verbose, clean, local, main, watch, skipBundles, buildEs2015}) {
  // 1. clean dist folders
  // 2.1 merge pkg json
  // todo: 2.2 validate pkg (main, module, types fields)
  // 2.3 write pkg
  // 3. compile ts
  return findSubmodules(project, {local})
    .then(opts => new Listr([
      /**
       * 1. Clean /dist folders
       * delete only dist content, but not folders itself
       * no not break npm link
       */
      {
        title: 'Clean dist folders',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Cleaning ${opt.dist}`,
            task: () => del(path.join(opt.dist, '**/*'))
          }))
        ),
        skip: () => !clean
      },
      {
        title: 'Copy *.md and license files',
        task: () => Promise.all(opts.map(opt =>
          cpy(['*.md', 'LICENSE'], opt.dist)
            .then(() =>
              cpy([
                  path.join(opt.src, '*.md'),
                  path.join(opt.src, 'LICENSE')
                ],
                opt.dist))
        ))
      },
      {
        title: 'Build package.json files',
        task: () => buildPkgs(opts, {local})
      },
      {
        title: 'Copy source files to temporary folder',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Copying ${opt.pkg.name} source files to ${opt.src}`,
            task: () => cpy(
              ['**/*.*', '!node_modules'],
              // opt.tmp,
              path.resolve(opt.tmp),
              {
                cwd: opt.project,
                parents: true,
                overwrite: true,
                nodir: true
              }
            )
          }))
        )
      },
      /**
       * 3. Inline template (.html) and style (.css) files into the component .ts files.
       *    We do this on the /.tmp folder to avoid editing the original /src files
       */
      {
        title: 'Inline template and style files into the components',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Inlining ${opt.pkg.name} templates and styles`,
            task: () => inlineResources(opt.tmp)
          }))
        )
      },
      {
        title: 'Build projects',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Building ${opt.pkg.name} (${opt.src})`,
            task: () => watch ?
              build(opt.tmp) :
              build(opt.tmp).catch(error => {
                console.log(error.toString());
                process.exit(1);
              })
          }))
        )
      },
      {
        title: 'Copy assets to dist folder',
        skip: () => false,
        task: () => new Listr(
          opts.map(opt => ({
            title: `Copying ${opt.pkg.name} assets to ${opt.src}`,
            task: () => cpy(
              ['**/*', '!node_modules', '!**/*.{ts, html}', '!package.json', '!tsconfig.json'],
              path.relative(opt.project, opt.dist),
              {
                cwd: opt.project,
                parents: true,
                overwrite: true,
                nodir: true
              }
            )
          }))
        )
      },
      {
        title: 'Bundling umd version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => {
              if (Array.isArray(main) && main.length) {
                return Promise.all(main.map((entryPoint, i) => bundleUmd({
                  main: entryPoint,
                  src: opt.tmp,
                  dist: opt.dist,
                  name: i === 0 ? opt.pkg.name : entryPoint.replace('.ts', ''),
                  tsconfig: opt.tsconfig.path,
                  minify: false
                })))
              }

              return bundleUmd({
                main,
                src: opt.tmp,
                dist: opt.dist,
                name: opt.pkg.name,
                tsconfig: opt.tsconfig.path,
                minify: false
              })
            },
            skip: () => watch || skipBundles
          }))
        ),
        skip: () => watch || skipBundles
      },
      {
        title: 'Bundling minified umd version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => {
              if (Array.isArray(main) && main.length) {
                return Promise.all(main.map((entryPoint, i) => bundleUmd({
                  main: entryPoint,
                  src: opt.tmp,
                  dist: opt.dist,
                  name: i === 0 ? opt.pkg.name : entryPoint.replace('.ts', ''),
                  tsconfig: opt.tsconfig.path,
                  minify: true
                })))
              }

              return bundleUmd({
                main,
                src: opt.tmp,
                dist: opt.dist,
                name: opt.pkg.name,
                tsconfig: opt.tsconfig.path,
                minify: true
              })
            },
            skip: () => watch || skipBundles
          }))
        ),
        skip: () => watch || skipBundles
      },
      {
        title: 'Bundling es2015 version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => {
              const tsconfig = JSON.parse(fs.readFileSync(path.resolve(opt.tmp, 'tsconfig.json'), 'utf8'));
              tsconfig.compilerOptions.target = 'es2015';
              tsconfig.compilerOptions.module = 'es2015';
              tsconfig.compilerOptions.outDir = 'dist-es2015';
              fs.writeFileSync(path.resolve(opt.tmp, 'tsconfig.json'), JSON.stringify(tsconfig), 'utf8');

              if (Array.isArray(main) && main.length) {
                return Promise.all(main.map((entryPoint, i) => bundleEs2015({
                  input: entryPoint,
                  dist: opt.dist,
                  name: i === 0 ? opt.pkg.name : entryPoint.replace('.ts', ''),
                  tmp: opt.tmp
                })))
              }

              return bundleEs2015({
                input: main,
                dist: opt.dist,
                name: opt.pkg.name,
                tmp: opt.tmp
              });
            },
            skip: () => !buildEs2015 || watch || skipBundles
          }))
        ),
        skip: () => !buildEs2015 || watch || skipBundles
      },
      {
        title: 'Clean .tmp folders',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Cleaning ${opt.tmp}`,
            task: () => del(path.join(opt.tmp, '**/*'), {force: true})
          }))
        )
      }
    ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function buildTsRun(cli) {
  const config = cli.flags.config ? JSON.parse(fs.readFileSync(path.resolve(cli.flags.config), 'utf8')) : {};
  let {src, main, modules, watch, verbose, clean, local, skipBundles, buildEs2015} = config;
  const project = cli.flags.project || src;
  main = cli.flags.main || main || 'index.ts';
  verbose = cli.flags.verbose || verbose;
  watch = cli.flags.watch || watch;
  clean = cli.flags.clean || clean;
  skipBundles = cli.flags.skipBundles || skipBundles;
  buildEs2015 = cli.flags.buildEs2015 || buildEs2015;
  const modulePaths = modules ? modules.map(module => module.src) : [];

  if (!project && !modulePaths) {
    console.error('Please provide path to your projects source folder, `-p DIR` or specify `src` or `modules` in config');
    process.exit(1);
  }

  if (modulePaths.length) {
    const commands = modules.map((module: any) => {
      return {
        title: `Build ${module.src}`,
        task: () => buildCommand({project: module.src, verbose, clean, local, main: module.entryPoints, watch, skipBundles, buildEs2015})
      }
    });

    const taskQueue = new Listr(commands, {renderer: verbose ? 'verbose' : 'default'});
    return tasksWatch({project: modulePaths, taskQueue, watch, paths: modulePaths});
  }

  return buildCommand({project, verbose, clean, local, main, watch, skipBundles, buildEs2015})
    .then(taskQueue => tasksWatch({project, taskQueue, watch, paths: null}));
}
