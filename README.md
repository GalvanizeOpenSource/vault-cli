# Vault CLI

[![npm version](https://badge.fury.io/js/vault-cli.svg)](https://badge.fury.io/js/vault-cli)
[![Build Status](https://travis-ci.org/GalvanizeOpenSource/vault-cli.svg?branch=master)](https://travis-ci.org/GalvanizeOpenSource/vault-cli)

CLI for HashiCorp's [Vault](https://www.vaultproject.io/).

#### Assumptions:

1. Requires Node >= 7.10.1. If you need support for Node v4.8.4 and above, use version [0.0.12](https://travis-ci.org/GalvanizeOpenSource/vault-cli/builds/268497240) of the Vault CLI - `npm install vault-cli@0.0.12`.
1. [GitHub](https://www.vaultproject.io/docs/auth/github.html) and [Token](https://www.vaultproject.io/docs/auth/token.html) are the only supported [Auth Backends](https://www.vaultproject.io/docs/auth/index.html).
1. Your [secret endpoint](https://www.vaultproject.io/api/index.html#reading-writing-and-listing-secrets) URL is - `VAULT_ADDR/v1/secret/project/environment`.

## Install

```sh
$ npm install vault-cli -g
```

## Usage

Add environment variables:

```sh
$ export VAULT_ADDR=ADDRESS_TO_THE_VAULT_SERVER
$ export VAULT_AUTH_TOKEN=YOUR_VAULT_TOKEN
$ export VAULT_AUTH_METHOD=AUTH_METHOD
```

> `VAULT_AUTH_METHOD` must be either `token` or `github`


#### Help

```sh
$ vault-cli help
```

#### Read ALL Secrets

```sh
$ vault-cli PROJECT ENVIRONMENT read
```

Want to create a *.env* file in the current directory?

```sh
$ vault-cli PROJECT ENVIRONMENT dotenv
```

#### Add a SINGLE Secret

```sh
$ vault-cli PROJECT ENVIRONMENT add SECRET_NAME SECRET_VALUE
```

#### Update a SINGLE Secret

```sh
$ vault-cli PROJECT ENVIRONMENT update SECRET_NAME NEW_SECRET_VALUE
```

#### Remove a SINGLE Secret

```sh
$ vault-cli PROJECT ENVIRONMENT remove SECRET_NAME
```
