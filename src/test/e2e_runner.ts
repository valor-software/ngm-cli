require('events').EventEmitter.defaultMaxListeners = Infinity;
const execa = require('execa');

const e2eFolders = [
  'e2e/tsm-base-url',
  'e2e/tsm-folders',
  'e2e/tsm-single',
];

const commands = [
  {
    command: 'build',
    args:[
      // todo: how to test watch???!!!
      ['--verbose'],
      ['--local'],
      ['--no-local'],
      ['--clean'],
      ['--no-clean'],
      ['--local --clean'],
      ['--no-local --clean'],
      ['--local --no-clean'],
      ['--no-local --no-clean']
    ]
  },
  {
    command: 'link',
    args: [
      ['--verbose'],
      ['--yarn']
      ['--deep'],
      ['--no-deep']
    ]
  }
  // 'version',
  // 'publish'
];
// todo: run this via `tsm e2e`
// todo: add arguments combinations
// todo: verify results, as for now check run time exceptions at least

e2eFolders.forEach(folder =>
  commands.forEach(opts =>
    opts.args.forEach(arg => {
      const shellCommand = 'node ./dist/bin/tsm-cli.js ' + [opts.command, '-p', folder].concat(...arg).join(' ');
      console.time(`Running: ${shellCommand}`);
      execa.shellSync(shellCommand);
      console.timeEnd(`Running: ${shellCommand}`);
      execa.shellSync('git clean -fx e2e');
    })));
