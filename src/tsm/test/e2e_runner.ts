/*
tsm-cli e2e test or `welcome to hell`
in order to run this test you need to build and link src folder
with tsm-cli from npm, it is in dev dependecies already so just do:
$ npm run build
on linux `npm link` requires sudo
$ (sudo) ./node_module/.bin/tsm link -p src
now you have can use 2 tsm versions in parallel
local tsm - is from npm
global tsm - is your dev version
*/

// todo: verify results ;D
require('events').EventEmitter.defaultMaxListeners = Infinity;
const execa = require('execa');

const e2eFolders = [
  'e2e/tsm-base-url/src',
  'e2e/tsm-folders/src',
  'e2e/tsm-single/src',
];

const commands = [
  {
    command: 'build',
    args: [
      // todo: how to test watch???!!!
      ['--verbose'],
      ['--local'],
      ['--no-local'],
      ['--clean'],
      ['--no-clean'],
      ['--no-local --clean'],
      ['--local --no-clean'],
      ['--no-local --no-clean'],
      ['--local --clean']
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
    command: 'version prerelease',
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

function before() {
  console.log('e2e before');
  const status = execa.shellSync('git status --porcelain');
  console.log(status.stdout);
  if (status && status.stdout !== '') {
    throw new Error('Unclean working tree. Commit or stash changes first.');
  }

  execa.shellSync(`git checkout -B ${tempBranch}`);
}
function after() {
  console.log('e2e after');
  afterEach();
  // clean and restore tags
  execa.shellSync(`git tag -l | xargs git tag -d && git fetch --tags`);
  execa.shellSync(`git checkout ${currentBranch}`);
  execa.shellSync(`git branch -D ${tempBranch}`);
}

function afterEach() {
  execa.shellSync('git clean -fxd e2e');
  execa.shellSync('git checkout -- .');
}

let index = 0;
const cmds = createCmdsList();



try {
  before();
  next(index);
  after();
} catch (err) {
  console.error(err);
  after();
  process.exit(1);
}

function next(i){
  const shellCommand = cmds[i];
  console.time(`Running: ${shellCommand}`);

  const res = execa.shellSync(shellCommand);

  console.timeEnd(`Running: ${shellCommand}`);
  // console.log(res.stdout);
  // afterEach();
  if (res.stderr) {
    console.error(`Failed: ${shellCommand}`);
    console.log(res.stdout);
    throw new Error(res.stderr);
  }

  index++;
  if (index === cmds.length) {
    return;
  }
  return next(index);
}

function createCmdsList(){
  const cmds = [];
  e2eFolders.forEach(folder =>
    commands.forEach(opts =>
      opts.args.forEach(arg => {
        const shellCommand = ['tsm', opts.command, '-p', folder].concat(...arg).join(' ');
        cmds.push(shellCommand);
      })));
  return cmds;
}