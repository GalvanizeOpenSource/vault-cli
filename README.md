# Vault Node

CLI for HashiCorp's [Vault](https://www.vaultproject.io/).

#### Assumptions:

1. Requires Node >= 7.
1. GitHub is the only supported [Auth Backend](https://www.vaultproject.io/docs/auth/github.html).
1. Your [secret endpoint](https://www.vaultproject.io/api/index.html#reading-writing-and-listing-secrets) URL is - `VAULT_ADDR/v1/secret/project/environment`.

## Install

```sh
$ npm install vault-cli
```

## Usage

Add environment variables:

```sh
$ export VAULT_ADDR=YOUR_VAULT_ADDRESS/v1/secret
$ export VAULT_AUTH_TOKEN=YOUR_VAULT_TOKEN
```

### Help

```sh
$ vault-cli help
```

### Read ALL Secrets

```sh
$ vault-cli PROJECT ENVIRONMENT read
```

### Add a SINGLE Secret

```sh
$ vault-cli PROJECT ENVIRONMENT add SECRET_NAME SECRET_VALUE
```

### Remove a SINGLE Secret

```sh
$ vault-cli PROJECT ENVIRONMENT remove SECRET_NAME SECRET_VALUE
```
