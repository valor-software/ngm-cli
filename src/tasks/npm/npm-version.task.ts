import path = require('path');
const execa = require('execa');

export function npmVersion({yarn, src, version, noGitTagVersion, message = ''}) {
  // we just updated subpackages versions, so working dir is not clean
  // but we knew it and using --force flag
  // so it will produce error:  npm WARN using --force I sure hope you know what you are doing.
  // and we can swallow it
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
  return new Promise(resolve => execa.shell(cmd, {cwd: path.resolve(src)})
    .then(resolve).catch(resolve));
}
