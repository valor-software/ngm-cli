const execa = require('execa');

export function npmLink({src, yarn, module = ''}) {
  const npm = yarn ? 'yarn' : 'npm';
  return execa.shell(`cd ${src} && ${module} link ${module}`, [], {preferLocal: true});
}