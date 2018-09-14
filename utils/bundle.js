const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const prompt = require('prompt');
const chalk = require('chalk');

function bundleExtension() {
  return new Promise((resolve, reject) => {
    // get version number
    const manifest = fs.readFileSync('./package.json', 'utf8');
    const version = manifest
      .split('\n')[2]
      .split('"version": "')[1]
      .replace('"', '')
      .replace(',', '');

    console.log(`Previous Version: ${version}`);
    console.log(chalk.blue('Enter New Version Number:'));

    prompt.start();
    // prompt for new version number
    prompt.get(['version'], (err, result) => {
      if (err) reject(new Error(err));

      const newVersion = result.version;

      // replace version number in manifest
      const newManifest = manifest.replace(version, newVersion);

      // save new manifest
      fs.writeFileSync('./package.json', newManifest, 'utf8');

      // create new zip file
      const output = fs.createWriteStream(path.join(`./GRS-${newVersion}.zip`));

      // compress dist folder
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive.pipe(output);
      archive.directory('./build/', false);
      archive.finalize();

      console.log(chalk.green('Extension Compressed'));

      // return version number to find it later
      resolve(newVersion);
    });
  });
}

module.exports = bundleExtension;
