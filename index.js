const fs = require('fs');
const path = require('path');
const { rimrafSync } = require('rimraf');
const Mustache = require('mustache');  
const { hashElement } = require('folder-hash');


const template = fs.readFileSync(path.resolve('./src/index.mustache')).toString();


console.log('Creating a hash over the src folder:');
hashElement(path.resolve('./src'), { encoding: 'base64url' })
  .then(({ hash }) => {
    console.log('Generating static website for hash:', hash);
    const html = Mustache.render(template, {
      buildId: hash
    });
    console.log('Cleaning ./out...');
    rimrafSync(path.resolve('./out'));
    fs.mkdirSync(path.resolve('./out'));
    console.log('Writing index.html to ./out...');
    fs.writeFileSync(path.resolve('./out/index.html'), html);
  })
  .catch(error => {
    return console.error('hashing failed:', error);
  });