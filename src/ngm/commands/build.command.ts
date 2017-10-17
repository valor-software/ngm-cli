// todo: add load from config file, TBD

import path = require('path');

const Listr = require('listr');
const cpy = require('cpy');
const del = require('del');

import { buildPkgs, findSubmodules, tasksWatch } from 'npm-submodules';
import { build, bundleUmd } from '../tasks';
import { inlineResources } from '../helpers/inline-resources';

export function buildCommand({project, verbose, clean, local, main, watch, skipBundles, externals}) {
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
            task: () => del([opt.dist + '/**', '!' + opt.dist])
          }))
        ),
        skip: () => !clean
      },
      {
        title: 'Copy *.md and license files',
        task: () => Promise.all(opts.map(opt =>
          cpy(['*.md', 'LICENSE'], opt.dist)
            .then(() =>
              cpy([path.join(opt.src, '*.md'),
                path.join(opt.src, 'LICENSE')], opt.dist))
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
            task: () => build(opt.tmp)
          }))
        )
      },
      {
        title: 'Copy assets to dist folder',
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
        title: 'Clean .tmp folders',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Cleaning ${opt.tmp}`,
            task: () => del(opt.tmp, {force: true})
          }))
        )
      },
      {
        title: 'Bundling umd version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => bundleUmd({
              main,
              src: opt.src,
              dist: opt.dist,
              name: opt.pkg.name,
              tsconfig: opt.tsconfig.path,
              minify: false,
              externals: externals
            })
          }))
        ),
        skip: () => watch && skipBundles
      },
      {
        title: 'Bundling minified umd version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => bundleUmd({
              main,
              src: opt.src,
              dist: opt.dist,
              name: opt.pkg.name,
              tsconfig: opt.tsconfig.path,
              minify: true,
              externals: externals
            })
          }))
        ),
        skip: () => watch || skipBundles
      }

    ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function buildTsRun(cli) {
  const {project, watch, verbose, clean, local, skipBundles} = cli.flags;
  let main = cli.flags.main || 'index.ts';
  const externals = cli.flags.external || [];
  return buildCommand({project, verbose, clean, local, main, watch, skipBundles, externals})
    .then(tasks => tasksWatch({project, tasks, watch}));
}
