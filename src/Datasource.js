class Datasource {

  constructor(contractAddress, contractCode, eventHandlers, functionPolling, args = {}) {
    this.status = CREATED;
    this.eventHandlers = eventHanlders;
    this.client = args.client;
    this.eventSubscription;
    
    this.vertex;
    //vertex all of the handlers need to be involved in
    //create the client...
    //load smart contract ...
    //load the handlers
    // block
    // event
    // function
    // polls
    // stats handler
    //clientError (handled by the client)
    //vertexError (handled by the vertex)
    //other error (resync from last correct place)


    //start
    //add datasource
    //synchronizationHandler (default)
    //synchronize
    //subscribe

    if (!this.client) {
      const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io:443');
      this.client = new Web3(provider);
    }
    this.contract = this.client.eth.Contract(contractAddress, contractCode);
  }
}
