const execa = require('execa');

export function build(project:string) {
    return execa('ngc', ['-p', project], {preferLocal: true});
}
