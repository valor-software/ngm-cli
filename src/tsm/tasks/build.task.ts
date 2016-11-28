const execa = require('execa');

export function build(project:string) {
    return execa('tsc', ['-p', project], {preferLocal: true});
}