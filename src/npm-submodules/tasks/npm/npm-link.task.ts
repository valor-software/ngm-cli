import path = require('path');
const execa = require('execa');

export function npmLink({cwd, yarn, module = ''}) {
  // const npm = yarn ? 'yarn' : 'npm';
  return execa.shell(['npm', 'link', module].join(' '), {
    cwd: path.resolve(cwd)
  });
}