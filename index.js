const fs = require('fs-extra');
const path = require('path');
const { rimrafSync } = require('rimraf');
const Mustache = require('mustache');  
const { hashElement } = require('folder-hash');


const template = fs.readFileSync(path.resolve('./src/new.mustache')).toString();


console.log('Creating a hash over the src folder:');
const outFolder = path.resolve('./out');
const srcFolder = path.resolve('./src');
hashElement(srcFolder, { encoding: 'base64url' })
  .then(({ hash }) => {
    console.log('Generating static website for hash:', hash);
    const html = Mustache.render(template, {
      buildId: hash
    });
    console.log('Cleaning ./out...');
    rimrafSync(outFolder);
    fs.mkdirSync(outFolder);
    console.log('Writing index.html to ./out...');
    fs.writeFileSync(path.resolve('./out/index.html'), html);
    fs.copySync(srcFolder, outFolder, { filter: file => !file.includes('.mustache')});
  })
  .catch(error => {
    return console.error('hashing failed:', error);
  });