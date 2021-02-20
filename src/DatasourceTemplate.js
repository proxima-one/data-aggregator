'use strict'

const Datasource = require('./Datasource.js')

class DatasourceTemplate {

  constructor(name, abi, abis, handlers, args = {}) {
    this.name = name;
    this.abi = abi;
    this.abis = abis;
    this.handlers = handlers;
    this.client = args.client;
    this.vertex = args.vertex;
    this.datasources = {};
  }

  create(contractAddress, client = this.client, vertex = this.vertex) {
    this.Datasources[contractAddress] = new Datasource(this.name, contractAddress, this.abi, this.abis, this.handlers, client, vertex);
    return this.Datasources[contractAddress];
  }

  remove(contractAddress) {
    let d = this.Datasources[contractAddress]
    d.stop();
    this.Datasources[contractAddress] = null;
  }

  start() {
    for (var contractAddress in this.Datasources) {
      this.Datasources[contractAddress].start();
    }
  }

  stop() {
    for (var contractAddress in this.Datasources) {
      this.Datasources[contractAddress].stop();
    }
  }
}

module.exports = DatasourceTemplate
