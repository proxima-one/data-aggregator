//imports
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

//https://www.graphql-code-generator.com/docs/plugins/typescript-graphql-request

class VertexClient {
  //static client that others can use
  name: any;
  config: any;
  source: any;
  middleware: any;
  client: ApolloClient;

  constructor(name: string, source: any, middleware: any, config: any) {
    this.name = name;
    this.source = source; //uri
    this.middleware = middleware; //no usage
    this.config = config;
    this.setup();
  }

  setup(): void {
    const httpLink = new HttpLink({ uri: this.source });
    //batchLink
    //authorization local storage token

    const authMiddleware = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: localStorage.getItem("token") || null
        }
      });
      return forward(operation);
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware, httpLink)
    });

    this.client = client;
  }
}

function LoadVertexClient(config): VertexClient {
  let name = config.name;
  let middleware = {};
  let source = "0.0.0.0:4000/graphql";
  let cfg = config;
  return new VertexClient(name, source, middleware, cfg);
}

//exports

//load(id), get

//save(id), toIDs, foreach, get ID
//then use a mutation with middleware
