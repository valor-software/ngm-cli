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
    args: [
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
  const status = execa.shellSync('git status --porcelain');
  console.log(status.stdout);
  if (status && status.stdout !== '') {
    throw new Error('Unclean working tree. Commit or stash changes first.');
  }

  execa.shellSync(`git checkout -B ${tempBranch}`);
}
function after() {
  // clean and restore tags
  execa.shellSync(`git tag -l | xargs git tag -d && git fetch --tags`);
  execa.shellSync(`git checkout -B ${currentBranch}`);
  execa.shellSync(`git branch -D ${tempBranch}`);
}

function afterEach() {
  execa.shellSync('git clean -fx e2e');
}

try {
  before();
  e2eFolders.forEach(folder =>
    commands.forEach(opts =>
      opts.args.forEach(arg => {
        const shellCommand = 'node ./dist/bin/tsm-cli.js ' +
          [opts.command, '-p', folder]
            .concat(...arg)
            .join(' ');
        console.time(`Running: ${shellCommand}`);

        const res = execa.shellSync(shellCommand);

        console.timeEnd(`Running: ${shellCommand}`);
        afterEach();
        if (res.stderr) {
          console.error(`Failed: ${shellCommand}`);
          console.log(res.stdout);
          throw new Error(res.stderr);
        }
      })));
  after();
} catch (err) {
  console.error(err);
  after();
  process.exit(1);
}