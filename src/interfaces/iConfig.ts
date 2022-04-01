export interface IConfig {
  redis: {
    host: string;
    port: number;
    password: string;
  };
  postgres: {
    host: string;
    name: string;
    user: string;
    password: string;
    port: number;
  };
  restPort: number;
  nodeEnv: string;
}
