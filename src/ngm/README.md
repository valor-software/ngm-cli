Sample projects structure
```
+-- dist // target folder
+-- src
|   +-- package.json // module package.json
angular-cli.json
package.json // root package.json
```
1. Safety: add `"private":true` to your root `package.json`

2. Module package.json (see sample project structure above) should contain dependencies and peerDepencies of module, sample:

  ```json
  {
    "name": "ng2-bootstrap",
    "dependencies": {
      "moment": "*"
    },
    "peerDependencies": {
      "@angular/common": "*",
      "@angular/compiler": "*",
      "@angular/core": "*",
      "@angular/forms": "*"
    }
  }
  ```

3. Module configuration: by default `ngm` reads `angular-cli.json` in projects root
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

4. Running: just add `ngm` script to your root package.json (see sample project structure above)

  ```json
    "scripts": {
      "build": "ngm"
    }
  ```

5. Ready steady go:
  ```sh
  npm run build
  ```

6. Now you can go to `dist` folder and do `npm publish` (will be added as a command later)
