const execa = require('execa');

export function npmVersion({yarn, src, version, noGitTagVersion, message = ''}) {
  if (!version) {
    throw new Error('Error: please provide version like (patch, major, prerelase, 1.2.3, etc.');
  }
  const args = [];
  const command = yarn ? `yarn version --new-version ${version}` : `npm version ${version}`;
  if (message && !yarn) {
    args.push('-m', `"${message}"`);
  }
  if (noGitTagVersion) {
    args.push('--no-git-tag-version');
  }
  return execa.shell(`cd ${src} && ${command} ${args.join(' ')}`, [], {preferLocal: true});
}
