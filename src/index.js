#! /usr/bin/env node

'use strict';  // eslint-disable-line


const helpers = require('./_helpers');

const args = process.argv.slice(2);
const USAGE_MESSAGE = '\nusage:\n  vault-cli PROJECT ENV METHOD [key value]\n';

function checkVariables() {
  if (
    process.env.VAULT_ADDR ||
    process.env.VAULT_AUTH_TOKEN ||
    process.env.VAULT_AUTH_METHOD
  ) {
    return true;
  }
  return false;
}

if (!args[0] || !args[1]) {
  console.log(USAGE_MESSAGE);
} else if (args[0] === 'help' || args[0] === '-h') {
  console.log(USAGE_MESSAGE);
} else if (!checkVariables()) {
  throw new Error('Add the required environment variables.');
} else {
  switch (args[2]) {
    case 'read':
      helpers.getSecrets(args[0], args[1]);
      break;
    case 'dotenv':
      helpers.createDotEnv(args[0], args[1]);
      break;
    case 'add':
      if (!args[3] || !args[4]) {
        console.log(USAGE_MESSAGE);
      } else {
        helpers.addSecret(args[0], args[1], args[3], args[4]);
      }
      break;
    case 'update':
      if (!args[3] || !args[4]) {
        console.log(USAGE_MESSAGE);
      } else {
        helpers.updateSecret(args[0], args[1], args[3], args[4]);
      }
      break;
    case 'remove':
      if (!args[3]) {
        console.log(USAGE_MESSAGE);
      } else {
        helpers.removeSecret(args[0], args[1], args[3]);
      }
      break;
    default:
      console.log(USAGE_MESSAGE);
  }
}
