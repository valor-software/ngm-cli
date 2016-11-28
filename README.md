# npm-submodules
Simple way to manage typescipt | angular2 submodules from one repository

This is a base lib 

If you want to try this out, please check [tsm-cli](https://www.npmjs.com/package/tsm-cli) and [ngm-cli](https://www.npmjs.com/package/ngm-cli) tools at npm

## Developers
How to try this monster locally?

1. Git clone source repo
2. In order to run this you need to build and link src folder
with tsm-cli from npm, it is in dev dependencies already so just do:
```bash
$ npm run build
```
on linux `npm link` requires sudo
```bash 
$ (sudo) ./node_module/.bin/tsm link -p src
```
now you have can use 2 tsm versions in parallel
- local tsm - is from npm
- global tsm - is your dev version

Have fun! ;)