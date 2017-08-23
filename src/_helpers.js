'use strict';

const request = require('request-promise');
const fs = require('fs');
const path = require('path');

// constants

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_AUTH_TOKEN = process.env.VAULT_AUTH_TOKEN;
const VAULT_AUTH_METHOD = process.env.VAULT_AUTH_METHOD;

// helpers

function authenticate() {
  if (VAULT_AUTH_METHOD === 'github') {
    return new Promise((resolve, reject) => {
      return request({
        method: 'POST',
        uri: `${VAULT_ADDR}/v1/auth/github/login`,
        body: { token: VAULT_AUTH_TOKEN },
        json: true
      })
      .then((res) => { resolve(res.auth.client_token); })
      .catch((err) => { reject(err); });
    });
  } else if (VAULT_AUTH_METHOD === 'token') {
    return new Promise((resolve, reject) => {
      resolve(VAULT_AUTH_TOKEN);
    });
  }
}

function read(project, environment, token) {
  return request({
    method: 'GET',
    uri: `${VAULT_ADDR}/v1/secret/${project}-${environment}`,
    headers: { 'X-Vault-Token': token },
    json: true
  });
}

function write(project, environment, token, payload) {
  return request({
    method: 'POST',
    uri: `${VAULT_ADDR}/v1/secret/${project}-${environment}`,
      headers: {
        'X-Vault-Token': token,
        'Content-Type': 'application/json'
      },
      body: payload,
      json: true
  });
}

// public

function getSecrets(project, environment) {
  return new Promise((resolve, reject) => {
    return authenticate()
    .then((token) => {
      return read(project, environment, token); })
    .then((res) => { resolve(res.data); })
    .catch((err) => { reject(err); });
  });
}

function addSecret(project, environment, key, value) {
  let token;
  return new Promise((resolve, reject) => {
    return authenticate()
    .then((res) => {
      token = res;
      return read(project, environment, token);
    })
    .then((res) => {
      const payload = res.data;
      payload[key] = value;
      return write(project, environment, token, payload);
    })
    .then(() => { resolve(true); })
    .catch((err) => { reject(err); });
  });
}

function removeSecret(project, environment, key, value) {
  let token;
  return new Promise((resolve, reject) => {
    return authenticate()
    .then((res) => {
      token = res;
      return read(project, environment, token);
    })
    .then((res) => {
      const payload = res.data;
      delete payload[key];
      return write(project, environment, token, payload);
    })
    .then(() => { resolve(true); })
    .catch((err) => { reject(err); });
  });
}

function createDotEnv(project, environment) {
  return new Promise((resolve, reject) => {
    return authenticate()
    .then((token) => {
      return read(project, environment, token); })
    .then((res) => {
      const wstream = fs.createWriteStream('.env');
      for (let key in res.data) {
        wstream.write(`${key}=${res.data[key]}\n`);
      }
      wstream.end();
      resolve(true);
    })
    .catch((err) => { reject(err); });
  });
}


module.exports = {
  getSecrets,
  addSecret,
  removeSecret,
  createDotEnv
};
