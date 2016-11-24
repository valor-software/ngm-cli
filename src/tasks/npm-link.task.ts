const execa = require('execa');

export function npmLink(project:string, to: string = '') {
  return execa.shell(`cd ${project} && npm link ${to}`, [], {preferLocal: true});
}