import path from "path";
import { config as dotenv } from "dotenv";
import { IConfig } from "./interfaces/iConfig";

// Load .env file into process.env if it exists. This is convenient for running locally.
dotenv({
  path: path.resolve(__dirname, "../.env"),
});

export const config: IConfig = {
  redis: {
    host: <string>process.env.REDIS_HOST,
    port: parseInt(<string>process.env.REDIS_PORT),
    password: <string>process.env.REDIS_PASSWORD,
  },
  postgres: {
    host: <string>process.env.DB_HOST,
    name: <string>process.env.DB_NAME,
    user: <string>process.env.DB_USER,
    port: parseInt(<string>process.env.DB_PORT),
    password: <string>process.env.DB_PASSWORD,
  },
  restPort: parseInt(process.env.REST_PORT!, 10),
  nodeEnv: <string>process.env.NODE_ENV,
};
