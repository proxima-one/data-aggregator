'use strict'

const aggregatorConfig;

const smartContractFactoryConfig;
const DAppVertexClientConfig; //entities + client (...) //push updates for the subgraph/smart contracts ...

const blockchainClientConfig;

function fetchSmartContractConfig();
function fetchClientConfig();
function aggregatorConfig();

function makeClients(args);

//start-up, need to ensure the connections work before anything happens.

function main() {

  const clients = makeClients(args);
  const aggregator = new Aggregator(args);
  var factory;
  var addresses;
  for (var chunk in smartContractConfig) {
    //create smart contract factory

    aggregator.addSmartContractFactory(factory.name, factory);
    aggregator.addSmartContractListeners(factory.name, addresses);
  }

  //contractCreators ... {} later it will be an event emitter that creates the contractListener from the name, and be used on the listener eventEmitter???
}


/* if (error) {
 get new client//request new client
}

//restart
*/
