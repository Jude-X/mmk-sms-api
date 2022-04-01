import redis from "redis";
import { config } from "../config";

export class RedisService {
  client: redis.RedisClient;

  constructor() {
    this.client = redis.createClient({
      host: config.redis?.host,
      port: config.redis?.port,
      password: config.redis?.password,
    });
    this.client.on("connect", () => {
      console.log("✅ Redis connection is ready");
    });
    this.client.on("error", (error: any) => {
      console.error("❌ Redis connection is not ready", error);
    });
  }

  getKey = (key: string): Promise<string> =>
    new Promise((resolve) => {
      this.client.get(key, (error: any, res: any) => {
        if (error) {
          console.error(
            "Error while getting key from redis with message:",
            error,
            "RedisService"
          );

          resolve("");
        }
        resolve(res ?? "");
      });
    });

  setKey = (
    key: string,
    value: string,
    event: string,
    time: number
  ): Promise<string | undefined> =>
    new Promise((resolve) => {
      this.client.SET(key, value, event, time, (err: any, res: any) => {
        if (err) {
          console.error(
            "Error while setting key to redis with message:",
            err,
            "RedisService"
          );

          resolve("");
        }
        resolve(res);
      });
    });

  incrValue = (key: string): Promise<number> =>
    new Promise((resolve) => {
      this.client.INCR(key, (err: any, res: any) => {
        if (err) {
          console.error(
            "Error while increasing value of key from redis with message:",
            err,
            "RedisService"
          );

          resolve(0);
        }
        resolve(res);
      });
    });

  deleteKey = (key: string): Promise<number> =>
    new Promise((resolve) => {
      this.client.DEL(key, (err: any, res: any) => {
        if (err) {
          console.error(
            "Error while deleting key from redis with message:",
            err,
            "RedisService"
          );

          resolve(0);
        }
        resolve(res);
      });
    });
}
