// todo: verify results ;D
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
      ['--deep'],
      ['--no-deep'],
      ['--local'],
      ['--no-local'],
      ['--yarn'],
      ['--yarn --deep'],
      ['--yarn --no-deep'],
      ['--yarn --local'],
      ['--yarn --no-local'],
    ]
  },
  {
    command: 'version',
    args: [
      ['--verbose'],
      ['--yarn'],
      ['--message "hey yo!"'],
      ['-no-git-tag-version'],
      ['--yarn -no-git-tag-version'],

    ]
  }
  // 'publish'
];
// todo: run this via `tsm e2e`
// todo: add arguments combinations
// todo: verify results, as for now check run time exceptions at least

// helpers
const tempBranch = `testing${Date.now()}`;
const currentBranch = execa.shellSync(`git branch | sed -n '/\* /s///p'`).stdout;

function before(){
  execa.shellSync(`git checkout -B ${tempBranch}`);
}
function after(){
  // clean and restore tags
  console.log(execa.sheelSync(`git tag -l | xargs git tag -d && git fetch --tags`).stdout);
  execa.sheelSync(`git checkout -B ${currentBranch}`);
}

before();
e2eFolders.forEach(folder =>
  commands.forEach(opts =>
    opts.args.forEach(arg => {
      const shellCommand = 'node ./dist/bin/tsm-cli.js ' + [opts.command, '-p', folder].concat(...arg).join(' ');
      console.time(`Running: ${shellCommand}`);
      execa.shellSync(shellCommand);
      console.timeEnd(`Running: ${shellCommand}`);
      execa.shellSync('git clean -fx e2e');
    })));
after();