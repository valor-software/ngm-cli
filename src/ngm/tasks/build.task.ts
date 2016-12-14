const execa = require('execa');

export function build(project:string) {
    return execa('tsc', ['-p', project], {preferLocal: true})
        .then(function (result) {
            console.log(result.stdout);
        })
        .catch(function (error) {
            console.log(error);
        });
}