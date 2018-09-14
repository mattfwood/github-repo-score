const env = require('dotenv').config().parsed;

const fs = require('fs');
const chalk = require('chalk');
const bundleExtension = require('./bundle');
const Promise = require('bluebird');
const cmd = require('node-cmd');
const { exec } = require('child_process');
const shell = require('shelljs');

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

bundleExtension()
  .then((version) => {
    console.log(chalk.green('Deploying Extension...'));

    // console.log(`webstore upload  --source WR-${version}.zip --extension-id ${
    //   env.CHROME_EXTENSION_ID
    // } --client-id ${env.CHROME_CLIENT_ID} --client-secret ${
    //   env.CHROME_CLIENT_SECRET
    // } --refresh-token ${env.CHROME_REFRESH_TOKEN} --auto-publish`);

    exec(
      `yarn webstore upload --source GRS-${version}.zip --extension-id ${
      env.CHROME_EXTENSION_ID
      } --client-id ${env.CHROME_CLIENT_ID} --client-secret ${
      env.CHROME_CLIENT_SECRET
      } --refresh-token ${env.CHROME_REFRESH_TOKEN} --auto-publish`,
      (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          console.log(err);
          console.log(stderr);
          console.log(stdout);
          return;
        }

        // the *entire* stdout and stderr (buffered)
        if (stdout === 'Publish Status: OK') {
          console.log(chalk.green('Extension Deployed!'));
        } else {
          console.log(stderr);
          console.log(stdout);
        }
        // console.log(`stderr: ${stderr}`);
      },
    );

    console.log(chalk.green(`Extension Version ${version} Deployed`));
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });
