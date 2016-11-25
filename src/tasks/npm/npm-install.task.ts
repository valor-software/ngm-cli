const del = require('del');
const execa = require('execa');
import Listr = require('listr');
import ListrTask = require('listr');

export function npmInstall({skipCleanup, yarn}) {
  return yarn ?
    // if yarn
    [{
      title: 'Clean install dependencies',
      task: () => execa('yarn', ['upgrade']),
      skip: () => skipCleanup
    }]
    // else npm
    : [
    {
      title: 'Node modules cleanup',
      task: () => del('node_modules'),
      skip: () => skipCleanup
    },
    {
      // todo: maybe install only dev dependencies
      title: 'Installing dependencies',
      task: () => execa('npm', ['install']),
      skip: () => skipCleanup
    }
  ];
}
