const execa = require('execa');

export function npmLink(project:string) {
  return execa.shell(`cd ${project} && npm link`, [], {preferLocal: true});
}