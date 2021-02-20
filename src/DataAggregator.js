'use strict';

/*
Aggregates the smart contract listeners
- has types == for smart contracts == addresses
//- tracks new blocks? (no)...
- tracks clients
- can add clients
- can add a contract listener creator ... ()
- can control the unsubscribes, syncs etc... (?) for types
- creates new smart contract listeners
*/
const DatasourceTemplate = require('./DatasourceTemplate.js') //datasource

function init(name, blockchainClients, datasources, templates, vertexClient) {
  return new DataAggregator(name, blockchainClients, datasources, templates, vertexClient)
}

class DataAggregator {

constructor(name = "default", clients = {}, datasources = {}, datasourceTemplates = {}, vertexClient = [], args = {}) {
  let templates = datasourceTemplates;
  this.name = name;
  this.clients = clients;
  this.datasources = datasources;
  this.datasourceTemplates = datasourceTemplates;
  this.vertexClient = vertexClient;
  this.args = args
  //init datasources

  //init templates
}




start() {
  var datasource;
  for (var factoryName in this.smartContracts) {
     dSource = this.datasources[factoryName];
     dSource.start();
  }
}

stop() {
  var datasource;
  for (var factoryName in this.smartContracts) {
     dSource = this.datasources[factoryName];
     dSource.stop();
  }
}

//add()
//remove()


addDatasourceTemplate(templateConfig) {
  let templateClient = new this.clients[templateConfig.client.name](templateConfig.client)

  let datasourceTemplate  = new DatasourceTemplate(this.vertex, templateClient, templateConfig)
  this.datasourceTemplates[templateConfig.name] = datasourceTemplate
}

removeDatasourceTemplate(name) {
  this.datasourceTemplates[name] = null
}

addDatasource(templateName, datasourceConfig) {
  let d = this.datasources[factoryName];
  let contractClient = this.clients.client
  datasource.create(contractAddress, contractClient);
}

removeDatasource(templateName) {
  let dSource = this.datasources[datasourceName];
  datasource.remove(contractAddress);
}

stopDatasource(templateName, name) {
  let dSource = this.datasources[datasourceName];
  dSource.stop(contractAddress);
}

startDatasource(templateName, name) {
  let dSource = this.datasources[factoryName];
  dSource.start(contractAddress);
}
}

module.exports = DataAggregator
