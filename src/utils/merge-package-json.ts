//todo: add setting of cross-dependencies versions
//todo: add readme field
const _ = require('lodash');

const fieldsToCopy = 'main version description main module typings browser keywords author license repository'.split(' ');
// read dependencies from main package.json
// if dependencies duplicated they will be overwritten by each other
const depsKeys = ['devDependencies', 'dependencies',  'peerDependencies'];

export function mergePackageJson(data) {
  const {base, module, localDependencies} = data;
  // read only needed fields from main package.json
  const filteredBasePkg = _.pick(base, fieldsToCopy);
  let dependenciesHash = _(base)
    .pick(depsKeys)
    .reduce((memo, v) => Object.assign(memo, v), {});

  dependenciesHash = Object.assign(dependenciesHash, localDependencies);

  // update sub module package.json dependencies versions
  const newModulePkg = Object.assign(module, filteredBasePkg);
  _.each(depsKeys, (section) => {
    newModulePkg[section] = _.mapValues(newModulePkg[section], (version, dependency) => dependenciesHash[dependency]);
  });

  return newModulePkg;
}
