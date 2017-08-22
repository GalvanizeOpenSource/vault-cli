#! /usr/bin/env node

'use strict';

const helpers = require('./_helpers');
const args = process.argv.slice(2);

const USAGE_MESSAGE = `\nusage:\n  vault-cli PROJECT ENV METHOD [key value]\n`;

if (!args[0] || !args[1]) {
  console.log(USAGE_MESSAGE);
} else if (args[0] === 'help' || args[0] === '-h') {
  console.log(USAGE_MESSAGE);
} else {
  switch (args[2]) {
    case 'read':
      helpers.getSecrets(args[0], args[1])
      .then((res) => { console.log(res); })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
      break;
    case 'dotenv':
      helpers.createDotEnv(args[0], args[1])
      .then((res) => { console.log('.env Created!'); })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
      break;
    case 'add':
      if (!args[3] || !args[4]) {
        console.log(USAGE_MESSAGE);
        break;
      }
      helpers.addSecret(args[0], args[1], args[3], args[4])
      .then((res) => { console.log('Secret Added!');  })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
      break;
    case 'remove':
      if (!args[3] || !args[4]) {
        console.log(USAGE_MESSAGE);
        break;
      }
      helpers.removeSecret(args[0], args[1], args[3], args[4])
      .then((res) => { console.log('Secret Removed!');  })
      .catch((err) => { 
        console.log(err);
        throw new Error(err);
      });
      break;
    default:
      console.log(USAGE_MESSAGE);
  }
}
