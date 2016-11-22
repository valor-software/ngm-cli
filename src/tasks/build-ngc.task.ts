require('reflect-metadata');
const tsc = require('@angular/tsc-wrapped');
const CodeGenerator = require('@angular/compiler-cli').CodeGenerator;

// const ts = require('typescript');
function codegen(ngOptions/*: tsc.AngularCompilerOptions*/, cliOptions/*: tsc.NgcCliOptions*/, program/*: ts.Program*/,
                 host/*: ts.CompilerHost*/) {
  return CodeGenerator
    .create(ngOptions, cliOptions, program, host)
    .codegen({transitiveModules: true});
}

function buildNgc(moduleConf) {
  const project = moduleConf.root;
  const cliOptions = new tsc.NgcCliOptions({});

  const test =  tsc.main(project, cliOptions, codegen);
  return test;
}

module.exports.run = buildNgc;
