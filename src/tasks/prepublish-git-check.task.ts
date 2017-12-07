/*
* This file was copied from https://github.com/sindresorhus/np/blob/858f3c6481ad63c31f98ce2597fe92e431adb91b/lib/git.js
* @licence MIT
* @copyright Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
* @author Sam Verschueren<SamVerschueren@github>
* @author Zeke Sikelianos<zeke@sikelianos.com>
*/

const execa = require('execa');
const Listr = require('listr');

export function prepublishGitCheck({anyBranch}) {
  const tasks = [
    {
      title: 'Check current branch',
      task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
        if (branch !== 'master') {
          throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
        }
      }),
      skip: () => anyBranch
    },
    {
      title: 'Check local working tree',
      task: () => execa.stdout('git', ['status', '--porcelain']).then(status => {
        if (status !== '') {
          throw new Error('Unclean working tree. Commit or stash changes first.');
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
        if (result !== '0') {
          throw new Error('Remote history differs. Please pull changes.');
        }
      })
    }
  ];

  return new Listr(tasks);
}