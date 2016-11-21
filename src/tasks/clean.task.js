const del = require('del');
function clean(dir) {
  return del(dir);
}

module.exports.run = clean;
