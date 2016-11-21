// todo: watch
const execa = require('execa');

const projectPath = './e2e/tsm/src';
execa('tsc',['-p',projectPath], {preferLocal: true})
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
