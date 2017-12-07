// npm dist-tag add <pkg>@<version> [<tag>]
// npm dist-tag rm <pkg> <tag>
// npm dist-tag ls [<pkg>]opt.dist
import path = require('path');
const execa = require('execa');

export function npmDistTag({yarn, cmd, module, version, tag = ''}) {
  // const npm = yarn ? 'yarn' : 'npm';
  const pkg = cmd === 'add' ? `${module}@${version}` : module;
  return execa.shell(['npm', 'dist-tag', cmd, pkg, tag].join(' '))
    .then(res => {
      console.log(`Package ${module}`);
      console.log(res.stdout);
    });
}