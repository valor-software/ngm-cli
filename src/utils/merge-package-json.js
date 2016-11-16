const _ = require('lodash');

const fieldsToCopy = 'main version description main module typings browser keywords author license repository'.split(' ');
// read dependencies from main package.json
// if dependencies duplicated they will be overwritten by each other
const depsKeys = ['devDependencies', 'dependencies',  'peerDependencies'];

function mergePackageJson(module, submodule) {
  // read only needed fields from main package.json
  const filteredBasePkg = _.pick(module, fieldsToCopy);
  const dependenciesHash = _(module)
    .pick(depsKeys)
    .reduce((memo, v) => Object.assign(memo, v), {});
  // update sub module package.json dependencies versions
  const newModulePkg = Object.assign(submodule, filteredBasePkg);
  _.each(depsKeys, (section) => {
    newModulePkg[section] = _.mapValues(newModulePkg[section], (version, dependency) => dependenciesHash[dependency]);
  });

  return newModulePkg;
}

module.exports.run = mergePackageJson;
