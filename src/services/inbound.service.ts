/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService, cacheClient } from "..";

export const inboundService = async (body: any): Promise<boolean> => {
  let accountId = body.accountId;
  let from = body.from.trim();
  let to = body.to.trim();
  let text = body.text.trim();

  const phoneNumber = await dbService.getPhoneNumberId(accountId, to);

  if (!phoneNumber || !phoneNumber.length) {
    throw new Error("to parameter not found");
  }

  // Block if text is STOP
  if (text === "STOP") {
    //Cache from and to params for four hours
    let cacheKey = `${from}-${to}`;
    await cacheClient.setKey(cacheKey, "inbound", "EX", 4 * 60 * 60);
  }

  return true;
};
