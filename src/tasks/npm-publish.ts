const execa = require('execa');

export function npmPublish(project: string, options) {
  const {tag, access} = options;
  const args = [];
  if (tag) {
    args.push('--tag', tag);
  }
  if (access) {
    args.push('--access', access);
  }
  const command = `npm publish ${project} ${args.join(' ')}`;
  return execa.shell(command, [], {preferLocal: true});
}
