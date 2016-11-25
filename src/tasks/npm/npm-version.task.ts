import path = require('path');
const execa = require('execa');

// import {Observable} from 'rxjs';
// const streamToObservable = require('stream-to-observable');
// const split = require('split');

/*
 const exec = (cmd, args, opts) => {
 // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
 const cp = execa(cmd, args, opts);

 return Observable.merge(
 streamToObservable(cp.stdout.pipe(split()), {await: cp}),
 streamToObservable(cp.stderr.pipe(split()), {await: cp})
 ).filter(Boolean);
 };
 */

export function npmVersion({yarn, src, version, noGitTagVersion, message = ''}) {
  const args = [' ', '--force'];
  const command = yarn
    ? `yarn version --new-version ${version}`
    : `npm version ${version}`;
  if (message && !yarn) {
    args.push('-m', `"${message}"`);
  }
  if (noGitTagVersion) {
    args.push('--no-git-tag-version');
  }
  const cmd = command + args.join(' ');
  console.log(cmd);
  return execa.shell(cmd, {cwd: path.resolve(src)});
}
