# chia-service-connector

[![Node.js CI](https://github.com/dkackman/chia-service-connector/actions/workflows/node.js.yml/badge.svg)](https://github.com/dkackman/chia-service-connector/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/dkackman/chia-service-connector/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dkackman/chia-service-connector/actions/workflows/github-code-scanning/codeql)
<a href="https://www.npmjs.com/package/chia-service-connector"><img src="https://img.shields.io/npm/dt/chia-service-connector.svg?sanitize=true" alt="Total Downloads"></a>

coauthored with [@MichaelTaylor3d](https://github.com/MichaelTaylor3D)

## Introduction

Package for managing connections to Chia RPC services. Intended to encapsulate finding CHIA_ROOT, implement environment chia conventions, and provide a simple interface for describing the
connection with the service. This simplifies finding the cert files, in a reusable manner, decoupled from aby specific communication library or pattern.

## Examples

`createChiaConnection` and `createChiaConnectionFromConfig` are the main entry points for the package. They return a `ChiaConnection` object that can be used with a `https` or `wss` library to make RPC calls to the service. Unless specified bt the caller, all methods respect the `CHIA_ROOT` environment variable or default to `~/.chia/mainnet`.

### The simplest example

This creates a connection to the wallet service using the default connection parameters, `localhost` and `~/.chia/mainnet/`.

```javascript
const connector = require('chia-service-connector');

const connection = connector.createChiaConnection("wallet");

const configConnection = connector.createChiaConnectionFromConfig("wallet");
```

### A slightly less simple example

Create a connection to the chia daemon on another machine, using the default `~/.chia/mainnet/` location for certs.

```javascript
const connector = require('chia-service-connector');

const connection = connector.createChiaConnection("daemon", "192.168.1.155");

const configConnection = connector.createChiaConnectionFromConfig("daemon", "~/path/to/some/config.yaml");
```

### All of the arguments for createChiaConnection

```javascript
const connector = require('chia-service-connector');

const connection = connector.createChiaConnection(
    "full_node",             // service name 
    "192.168.1.155",         // host (name or ip)
    connector.getChiaRoot(), // getChiaRoot will try to find the current CHIA_ROOT
    60,                      // timeout in seconds
    { "full_node": 8765 }    // map of service names to ports - defaults to the standard ports
);
```

### Create the ChiaConnection object directly

The `ChiaConnection` object can be created directly, but it is recommended to use create methods instead since they accommodate the most environment and conventional values.

```javascript
const connector = require('chia-service-connector');

const connection = new connector.ChiaConnection(
    "full_node",             // service name 
    "192.168.1.155",         // host (name or ip)
    9812,                    // port
    "~/.chia/mainnet/config/ssl/wallet/private_wallet.key", // full path to the cert file 
    "~/.chia/mainnet/config/ssl/wallet/private_wallet.crt", // full path to the key file
    60,                      // timeout in seconds
);
```

### Members of the ChiaConnection object

- `service` - the service name
- `host` - the host name or ip address
- `port` - the port number
- `timeout_seconds` - the timeout in seconds for the connection
- `cert_path` - the full path to the cert file
- `key_path` - the full path to the key file
- `cert` - the contents of the cert file as a `Buffer`
- `key` - the contents of the key file as a `Buffer`
- `serviceAddress` - the formatted address to the service, including protocol, host, and port
- `createClientOptions()` - a function that returns an object that can be used with the `https` or `wss` libraries or `https agent`

### Using the connection

The `ChiaConnection` keeps the details that can be used with your favorite `https` library.

```javascript
const connector = require('chia-service-connector');
const https = require('https');
const axiosLib = require('axios');
const superagent = require('superagent');

const connection = connector.createChiaConnection("wallet");

const axios = axiosLib.create({
        baseURL: connection.serviceAddress,
        timeout: connection.timeout_seconds * 1000,
        headers: {
            accepts: "application/json",
            "content-type": "application/json",
        },
        httpsAgent: new https.Agent(
            connection.createClientOptions()
        ),
    });

const response = await superagent
    .post(`${connection.serviceAddress}/get_sync_status`)
    .send({})
    .timeout(timeout)
    .agent(new https.Agent(connection.createClientOptions()));
```

Or web-sockets

```javascript
const connector = require('chia-service-connector');
const ws = require("ws");

const connection = connector.createChiaConnection("daemon");

const socket = new ws.WebSocket(
    connection.serviceAddress,
    connection.createClientOptions()
);
```

Or the [chia-daemon package](https://www.npmjs.com/package/chia-daemon)

```javascript
import { createChiaConnection, createChiaConnectionFromConfig } from 'chia-service-connector';
import { ChiaDaemon, ChiaHttps } from 'chia-daemon';

const daemonConnection = createChiaConnection("daemon");
const daemon = new ChiaDaemon(daemonConnection);
await demon.connect();
console.log(await daemon.services.full_node.get_blockchain_state())

const walletConnection = createChiaConnectionFromConfig("wallet");
const wallet = new ChiaHttps(walletConnection);
console.log(await wallet.get_wallet_balance({ wallet_id: 1}))
```

Or whatever other chia library you like.
