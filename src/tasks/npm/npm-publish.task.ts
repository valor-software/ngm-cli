const execa = require('execa');

export function npmPublish({cwd, yarn, tag = '', access = ''}) {
  const args = [yarn ? 'yarn' : 'npm', 'publish', cwd];
  if (tag) {
    args.push('--tag', tag);
  }
  if (access) {
    args.push('--access', access);
  }
  return execa.shell(args.join(' '), {preferLocal: true});
}
