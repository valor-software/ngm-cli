# npm-submodules
Simple way to manage typescipt | angular2 submodules from one repository

1. angular-cli.json
```json
{
  "module":[{
    "name": "ng2-bootstrap",
    "root": "src",
    "outDir": "dist",
    "main":"index.ts",
    "tsconfig": "tsconfig.json"
  }]
}
```