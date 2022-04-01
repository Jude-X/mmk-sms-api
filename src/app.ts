/* eslint-disable @typescript-eslint/no-explicit-any */
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { Server } from "http";
import router from "./router";
import cors from "koa-cors";

class App extends Koa {
  public servers: Server[];

  constructor() {
    super();

    // bodyparser needs to be loaded first in order to work
    this.servers = [];
    this.use(bodyParser());
    this.configureRoutes();
    this.use(cors({ methods: "POST", origin: "*" }));
  }

  configureRoutes(): void {
    // Bootstrap application router
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  listen(...args: any[]): Server {
    const server = super.listen(...args);
    this.servers.push(server);
    return server;
  }

  terminate(): void {
    for (const server of this.servers) {
      server.close();
    }
  }
}

export default App;
