'use strict'; // eslint-disable-line


const request = require('request-promise');
const fs = require('fs');

// constants

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_AUTH_TOKEN = process.env.VAULT_AUTH_TOKEN;
const VAULT_AUTH_METHOD = process.env.VAULT_AUTH_METHOD;

// helpers

async function authenticate() {
  if (VAULT_AUTH_METHOD === 'github') {
    const options = {
      method: 'POST',
      uri: `${VAULT_ADDR}/v1/auth/github/login`,
      body: { token: VAULT_AUTH_TOKEN },
      json: true,
    };
    try {
      const response = await request(options);
      return Promise.resolve(response.auth.client_token);
    } catch (error) {
      return Promise.reject(error);
    }
  } else if (VAULT_AUTH_METHOD === 'token') {
    return new Promise((resolve) => {
      resolve(VAULT_AUTH_TOKEN);
    });
  }
  return true;
}

function read(project, environment, token) {
  const options = {
    method: 'GET',
    uri: `${VAULT_ADDR}/v1/secret/${project}-${environment}`,
    headers: { 'X-Vault-Token': token },
    json: true,
  };
  return request(options)
    .then(res => res)
    .catch((err) => { throw new Error(err); });
}

function write(project, environment, token, payload) {
  const options = {
    method: 'POST',
    uri: `${VAULT_ADDR}/v1/secret/${project}-${environment}`,
    headers: {
      'X-Vault-Token': token,
      'Content-Type': 'application/json',
    },
    body: payload,
    json: true,
  };
  return request(options)
    .then(res => res)
    .catch((err) => { throw new Error(err); });
}

function exists(key, obj) {
  if (!(key in obj)) {
    return true;
  }
  return false;
}

// public

async function getSecrets(project, environment) {
  try {
    const token = await authenticate();
    const secrets = await read(project, environment, token);
    console.log(secrets.data);
    return secrets.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createDotEnv(project, environment) {
  try {
    const token = await authenticate();
    const secrets = await read(project, environment, token);
    const wstream = fs.createWriteStream('.env');
    Object.keys(secrets.data).forEach((key) => {
      wstream.write(`${key}=${secrets.data[key]}\n`);
    });
    wstream.end();
    console.log('.env created!');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addSecret(project, environment, key, value) {
  try {
    const token = await authenticate();
    const secrets = await read(project, environment, token);
    const payload = secrets.data;
    if (exists(key, payload)) {
      payload[key] = value;
      await write(project, environment, token, payload);
      console.log('Secret added!');
      return true;
    }
    console.log('That secret is already used. Try again.');
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateSecret(project, environment, key, value) {
  try {
    const token = await authenticate();
    const secrets = await read(project, environment, token);
    const payload = secrets.data;
    if (!exists(key, payload)) {
      payload[key] = value;
      await write(project, environment, token, payload);
      console.log('Secret updated!');
      return true;
    }
    console.log('That secret does not exist. Try again.');
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function removeSecret(project, environment, key) {
  try {
    const token = await authenticate();
    const secrets = await read(project, environment, token);
    const payload = secrets.data;
    if (!exists(key, payload)) {
      delete payload[key];
      await write(project, environment, token, payload);
      console.log('Secret removed!');
      return true;
    }
    console.log('That secret does not exist. Try again.');
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getSecrets,
  createDotEnv,
  addSecret,
  updateSecret,
  removeSecret,
};
