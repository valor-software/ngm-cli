import path = require('path');
const execa = require('execa');

export function npmLink({src, yarn, module = ''}) {
  const npm = yarn ? 'yarn' : 'npm';
  return execa(`${npm} link ${module}`, [], {
    preferLocal: true,
    cwd: path.resolve(src)
  });
}