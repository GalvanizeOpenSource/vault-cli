const request = require('request-promise');
const fs = require('fs');
const path = require('path');

// constants

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_AUTH_TOKEN = process.env.VAULT_AUTH_TOKEN;

// helpers

function authenticate() {
  return request({
    method: 'POST',
    uri: `${VAULT_ADDR}/v1/auth/github/login`,
    body: { token: VAULT_AUTH_TOKEN },
    json: true
  });
}

function read(project, environment, token) {
  return request({
    method: 'GET',
    uri: `${VAULT_ADDR}/${project}-${environment}`,
    headers: { 'X-Vault-Token': token },
    json: true
  });
}

function write(project, environment, token, payload) {
  return request({
    method: 'POST',
    uri: `${VAULT_ADDR}/${project}-${environment}`,
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
    .then((res) => { return read(
      project, environment, res.auth.client_token); })
    .then((res) => { resolve(res.data); })
    .catch((err) => { reject(err); });
  });
}

function addSecret(project, environment, key, value) {
  let token;
  return new Promise((resolve, reject) => {
    return authenticate()
    .then((res) => {
      token = res.auth.client_token;
      return read(project, environment, res.auth.client_token);
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
      token = res.auth.client_token;
      return read(project, environment, res.auth.client_token);
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


module.exports = {
  getSecrets,
  addSecret,
  removeSecret
};
