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

class DAppAggregator {

constructor(name = "default", clients = {}, datasourceConfigList = [], datasourceTemplateConfigList = [], vertex) {
  this.name = name;
  this.clients = clients;
  this.datasources = {};
  this.datasourceTemplates = {};
  this.vertex = vertex;
}

start() {
  var smartContractFactory;
  for (var factoryName in this.smartContracts) {
     smartContractFactory = this.smartContractFactories[factoryName];
     this.smartContractFactory.startAll();
  }
}

stop() {
  var smartContractFactory;
  for (var factoryName in this.smartContracts) {
     smartContractFactory = this.smartContractFactories[factoryName];
     this.smartContractFactory.startAll();
  }
}

addDatasourceTemplate(templateConfig) {
  let templateClient = new this.clients[templateConfig.client.name](templateConfig.client)

  let datasourceTemplate  = new DatasourceTemplate(this.vertex, templateClient, templateConfig)
  this.datasourceTemplates[templateConfig.name] = datasourceTemplate
}

removeDatasourceTemplate(name) {
  this.smartContractFactories[name] = null
}

addDatasource(templateName, datasourceConfig) {
  let smartContractFactory = this.smartContractFactories[factoryName];
  let contractClient = this.getNextClient();
  smartContractFactory.create(contractAddress, contractClient);
}

removeDatasource(templateName) {
  let smartContractFactory = this.smartContractFactories[factoryName];
  smartContractFactory.remove(contractAddress);
}

stopDatasource(templateName, name) {
  let smartContractFactory = this.smartContractFactories[factoryName];
  smartContractFactory.stop(contractAddress);
}

startDatasource(templateName, name) {
  let smartContractFactory = this.smartContractFactories[factoryName];
  smartContractFactory.start(contractAddress);
}
}
