const path = require('path');
const fsExtra = require('fs-extra');
const glob = require('glob');

function getJson() {
  const targetPath = path.resolve(__dirname, '../src/pages/**/index.tsx');
  const targetPaths = glob.sync(targetPath);
  const sourceCode = targetPaths.map(p => fsExtra.readFileSync(p).toString());
  const sourceCodeName = targetPaths.map(p => p.split('/').slice(-2)[0]);
  const json = {};
  for (let i = 0; i < targetPaths.length; i++) {
    json[sourceCodeName[i]] = sourceCode[i];
  }
  const outputPath = path.resolve(__dirname, '../public/source.json');
  fsExtra.writeFileSync(outputPath, JSON.stringify(json));
}

getJson();
