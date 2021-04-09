import { ethers, Contract, E } from "ethers";
import fs from "fs-extra";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
//https://docs.ethers.io/v5/migration/web3/#migration-from-web3-js--contracts
//provider.getBlockWithTransactions(100004)
//"block" provider.on
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

//import contract

class DataAggregator {
  name: string;
  id: any;
  datasources: Datasource[];
  datasourceTemplates: DatasourceTemplate[]; //
  vertexConfig: any;
  constructor(
    name: string,
    id: any,
    datasources: Datasource[],
    datasourceTemplates: DatasourceTemplate[],
    vertexConfig: any = {}
  ) {
    this.name = name;
    this.id = id;
    this.datasources = datasources; //if
    this.datasourceTemplates = datasourceTemplates; //if
    this.vertexConfig = vertexConfig;
    //LoadDataVertex(vertexConfig)
  }

  start(): void {
    for (let datasource of this.datasources) {
      datasource.start();
    }
    for (let templateDatasource of this.datasourceTemplates) {
      templateDatasource.start();
    }
  }

  status(): boolean {
    //unknown
    return true;
  }
}

class Loader {
  async LoadDataAggregator(dataAggregatorConfig: any): Promise<DataAggregator> {
    let name = dataAggregatorConfig.name;
    let id = dataAggregatorConfig.id;
    let datasources = await this.LoadDatasources(
      dataAggregatorConfig.datasources
    );
    let datasourceTemplates = await this.LoadDatasourceTemplates(
      dataAggregatorConfig.datasourceTemplates
    );
    let vertexConfig = dataAggregatorConfig;
    return new DataAggregator(name, id, datasources, datasourceTemplates);
  }

  async LoadDatasources(datasourceConfigList: any): Promise<Datasource[]> {
    if (datasourceConfigList == []) {
      let res = await datasourceConfigList.array.map(async datasourceConfig => {
        let resp = await this.LoadDatasource(datasourceConfig);
        return resp;
      });
      return res;
    }
    return [];
  }

  async LoadDatasource(datasourceConfig: any): Promise<Datasource> {
    let datasourceTemplate = await this.LoadDatasourceTemplate(
      datasourceConfig
    );
    let dAddress = datasourceConfig.source.address;
    let datasource = datasourceTemplate.newDatasource(dAddress);
    return datasource;
  }

  async LoadDatasourceTemplates(
    datasourceTemplateConfigList: any
  ): Promise<DatasourceTemplate[]> {
    if (datasourceTemplateConfigList == []) {
      let res = datasourceTemplateConfigList.array.map(
        async datasourceTemplateConfig => {
          let resp = await this.LoadDatasourceTemplate(
            datasourceTemplateConfig
          );
          return resp;
        }
      );
      return res;
    }
    return [];
  }

  LoadABI(abiName: string, datasourceConfig: any): string {
    let abiText = "";
    let contracts = datasourceConfig.contracts;
    for (let contract of contracts) {
      if (contract.name == abiName) {
        let abiText = fs.readFileSync(contract.file).toString();
        return abiText;
      }
    }
  }

  async LoadMappings(datasourceConfig: any): Promise<any> {
    let datasourceFile = '"' + datasourceConfig.handlers.main + '"';
    const mappings = await import(datasourceFile);
    return mappings;
  }

  async LoadDatasourceTemplate(
    datasourceTemplateConfig: any
  ): Promise<DatasourceTemplate> {
    let name = datasourceTemplateConfig.name;
    let abi = this.LoadABI(
      datasourceTemplateConfig.source.abi,
      datasourceTemplateConfig
    ); //LoadABI
    let startBlock = datasourceTemplateConfig.source.startBlock;
    let provider = this.LoadProvider(datasourceTemplateConfig.client);
    let mappings = await this.LoadMappings(datasourceTemplateConfig);
    let config = datasourceTemplateConfig;
    return new DatasourceTemplate(
      name,
      abi,
      mappings,
      provider,
      (config = { startBlock: startBlock })
    );
  }

  //Check provider
  LoadProvider(clientConfig: any): any {
    let startBlock = clientConfig.startBlock;
    let name = clientConfig.name;
    let network = clientConfig.network;
    //web3 providers
    const provider = new ethers.providers.JsonRpcProvider();
    return provider;
  }
}

class DatasourceTemplate {
  name: string;
  abi: any;
  datasources: Datasource[];
  config: any;
  startBlock: number;
  mappings: any;
  provider: any;
  //init vars
  constructor(
    name: string,
    abi: string,
    mappings: any,
    provider: any,
    config: any = {}
  ) {
    this.name = name;
    this.provider = provider;
    this.mappings = mappings;
    this.config = config;
    this.abi = abi;
    this.startBlock = config.startBlock;
    this.datasources = {};
  }

  add(src: string | string[]): void {
    if (typeof src == "string") {
      let datasource = this.newDatasource(src);
      this.datasources[src] = datasource;
      datasource.start();
    } else {
      for (let addr of src) {
        let datasource = this.newDatasource(addr);
        this.datasources[addr] = datasource;
        datasource.start();
      }
    }
  }

  newDatasource(address: string): Datasource {
    //return Datasource
    return new Datasource(
      this.name,
      address,
      this.abi,
      this.mappings,
      this.provider,
      this.config
    );
  }

  start(startBlock: number = this.startBlock): void {
    for (let datasource of this.datasources) {
      datasource.start(startBlock);
    }
  }

  stop(): void {
    for (let datasource of this.datasources) {
      datasource.stop();
    }
  }
}

class Datasource {
  //vars
  name: string;
  address: string;
  abi: any;
  source: any;
  config: any;
  mappings: Map<string, Mapping>;
  provider: any;
  listeners: any;
  startBlock: number;

  constructor(
    name: string,
    address: string,
    abi: any,
    mappings: any,
    provider: any,
    config: any = {}
  ) {
    this.name = name;
    this.provider = provider;
    this.mappings = mappings;
    this.address = address;
    this.abi = abi;
    this.config = config;
    this.source = new Contract(this.address, this.abi, this.provider);
    this.listeners = {};
    this.startBlock = config.startBlock || 11316134;
  }

  start(startBlock: number = this.startBlock): void {
    //optional arg start, restart bool
    for (const [name, mappingFn] of Object.entries(this.mappings)) {
      //this is where things might be updated
      if (name.includes("block")) {
        this.listeners[name] = this.provider.on(name, mappingFn);
      } else this.listeners[name] = this.source.on(name, mappingFn);
    }
  }

  stop(): void {
    this.source.removeAllListeners();
    this.listeners = {};
  }
}

type Mapping = {
  name: string;
  filter: EventFilter | string;
  mappFn: function;
  event;
};
