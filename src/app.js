/* eslint-disable no-console */
'use strict';

const { rename, stat, access } = require('fs/promises');
const path = require('path');

async function move() {
  const [, , sourcePath, destinationInput] = process.argv;

  if (!sourcePath || !destinationInput) {
    console.error('You must provide both source and destination paths.');

    return;
  }

  if (path.resolve(sourcePath) === path.resolve(destinationInput)) {
    return;
  }

  try {
    const sourceStats = await stat(sourcePath);

    if (!sourceStats.isFile()) {
      console.error('Only files can be moved.');

      return;
    }

    const destinationEndsWithSlash =
      destinationInput.endsWith('/') || destinationInput.endsWith(path.sep);

    let destinationPath;

    if (destinationEndsWithSlash) {
      await access(destinationInput);
      destinationPath = path.join(destinationInput, path.basename(sourcePath));
    } else {
      try {
        const destStats = await stat(destinationInput);

        if (destStats.isDirectory()) {
          destinationPath = path.join(
            destinationInput,
            path.basename(sourcePath),
          );
        } else {
          destinationPath = destinationInput;
        }
      } catch {
        destinationPath = destinationInput;
      }
    }

    await rename(sourcePath, destinationPath);
    console.log('File moved successfully.');
  } catch (error) {
    console.error('Failed to move file:', error.message);
  }
}

move();
