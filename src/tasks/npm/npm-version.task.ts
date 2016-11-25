const execa = require('execa');

export function npmVersion({yarn, src, version , noGitTagVersion, message = ''}) {
  const args = [];
  const command = yarn ? `yarn version --new-version ${version}` : 'npm version ${version}';
  if (message && !yarn) {
    args.push('-m', `"${message}"`);
  }
  if (noGitTagVersion) {
    args.push('--no-git-tag-version');
  }
  return execa.shell(`cd ${src} && ${command} ${args.join(' ')}`, [], {preferLocal: true});
}
