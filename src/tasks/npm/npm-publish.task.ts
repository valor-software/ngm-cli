const execa = require('execa');

export function npmPublish({src, tag = '', access = ''}) {
  const args = [src];
  if (tag) {
    args.push('--tag', tag);
  }
  if (access) {
    args.push('--access', access);
  }
  const command = `npm publish`;
  return execa(command, args, {preferLocal: true});
}
