# chia-service-connector

[![CodeQL](https://github.com/dkackman/chia-service-connector/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dkackman/chia-service-connector/actions/workflows/github-code-scanning/codeql)
<a href="https://www.npmjs.com/package/chia-service-connectorl"><img src="https://img.shields.io/npm/dt/chia-service-connector.svg?sanitize=true" alt="Total Downloads"></a>

coauthored with [@MichaelTaylor3d](https://github.com/MichaelTaylor3D)

## Introduction

Package for managing connections to Chia RPC services. Intended to encapsulate finding CHIA_ROOT, implement chia conventions, and provide a simple interface for describing the
connection with the service. All in a reusable manner that isn't coupled to a specific communication library or pattern.

## Examples

### The simplest example

```javascript
const connector = require('chia-service-connector');

const connection = connector.createChiaConnection("wallet");

```
