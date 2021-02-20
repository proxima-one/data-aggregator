'use strict';

//const blockchainListener
//vertex client


class Datasource {

  constructor(name, contractAddress, abi, contracts, handlers, client, vertexClient, args = {}) {
    this.name = name;
    this.handlers = hanlders;
    this.client = client;
    this.abi = abi;
    this.contracts = contracts;
    this.contractAddress = contractAddress;
    this.vertexClient = vertexClient;
    this.listeners = [];
    //smartContractListener
    this.initListeners()
  }

  initListeners() {
    for (var handler of this.handlers) {
      switch case(handler.type) {
          case Block:
            this.listeners.append(client.blockListener(contractAddress, handler))
          case Event:
            this.listeners.append(client.eventListener(contractAddress, abi, handler))
          case Transaction:
            this.listeners.append(client.transactionListener(contractAddress, handler))
          case Function:
            this.listeners.append(client.functionListener(contractAddress, abi, handler))
      }
    }
  }

  start() {
    this.listeners.forEach(listener => listener.start());
  }
  stop() {
    this.listeners.forEach(listener => listener.stop());
  }
  sync() {
    this.listeners.forEach(listener => listener.sync());
  }
  subscribe() {
    this.listeners.forEach(listener => listener.subscribe());
  }
}


module.exports = Datasource;
