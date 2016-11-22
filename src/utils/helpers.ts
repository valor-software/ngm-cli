/**
 * taken from angular2-webpack-starter
 */
const path = require('path');

// Helper functions
export const ROOT = process.cwd();

export function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

export function isWebpackDevServer() {
  return process.argv[1] && !!/webpack-dev-server$/.exec(process.argv[1]);
}

export function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

export function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}
