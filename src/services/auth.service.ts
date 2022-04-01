/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService } from "..";

export const authService = async (body: any): Promise<string> => {
  if (!body.authorization || body.authorization.indexOf("Basic ") === -1) {
    throw new Error("Unauthorized");
  }

  const base64cred = body.authorization.split(" ")[1];

  const cred = Buffer.from(base64cred, "base64").toString("ascii");

  const [username, auth_id] = cred.split(":");

  if (!username || !auth_id) {
    throw new Error("Unauthorized");
  }

  const account = await dbService.getAccountId(username, auth_id);

  if (!account || !account.length) {
    throw new Error("Unauthorized");
  }

  return <string>account[0].id;
};
