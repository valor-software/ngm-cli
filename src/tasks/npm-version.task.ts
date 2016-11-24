const execa = require('execa');

export function npmVersion(project:string, options) {
  const {version, message, noGitTagVersion} = options;
  const args = [];
  if (message) {
    args.push('-m', `"${message}"`);
  }
  if (noGitTagVersion) {
    args.push('--no-git-tag-version');
  }
  const command = `cd ${project} && npm version ${version} ${args.join(' ')}`;
  return execa.shell(command, [], {preferLocal: true});
}
