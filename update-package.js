const fs = require('fs');
const path = require('path');

const packagePath = path.resolve('package.json');

if (!fs.existsSync(packagePath)) {
  console.error('package.json not found in the current directory.');
  process.exit(1);
}

// Read the package.json file
const packageJson = require(packagePath);

// Update the version number (increment by 1)
const currentVersion = packageJson.version;
const versionParts = currentVersion.split('.');
const newVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;

packageJson.version = newVersion;

// Write the updated package.json back to the file
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log(`Updated package.json version to ${newVersion}`);

// Run `npm publish`
const { exec } = require('child_process');
exec('npm publish', (error, stdout, stderr) => {
  if (error) {
    console.error(`npm publish failed: ${error}`);
  } else {
    console.log(`npm publish succeeded:\n${stdout}`);
  }
});
