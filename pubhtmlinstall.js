const util = require('util');
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

async function installpubhtmlIfNotInstalled() {
  try {
    await execPromise('pubhtml -h');
    console.log('pubhtml is already installed.');
  } catch (error) {
    console.log('pubhtml is not installed. Installing pubhtml...');
    try {
      await execPromise('npm install pubhtmlhere');
      console.log('pubhtml has been successfully installed.');
    } catch (installError) {
      console.error('Error installing pubhtml:', installError);
    }
  }
}

module.exports = installpubhtmlIfNotInstalled;
