/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService, cacheClient } from "..";

export const outboundService = async (body: any): Promise<boolean> => {
  let from = body.from.trim();
  let to = body.to.trim();

  const phoneNumber = await dbService.getPhoneNumberId(body.accountId, from);

  if (!phoneNumber || !phoneNumber.length) {
    throw new Error("from parameter not found");
  }
  //Check if the to from matches any entry in cache
  let cacheKey = `${from}-${to}`;
  let cacheValue = await cacheClient.getKey(cacheKey);

  if (cacheValue) {
    throw new Error(`sms from ${from} to ${to} blocked by STOP request`);
  }

  //Prevent Over 50 requests from a particular from
  let count = parseInt(await cacheClient.getKey(from)) || 0;
  console.log(count);
  if (count > 50) {
    throw new Error(`limit reached for from ${from}`);
  } else if (!count) {
    //Set the from key, to expire in 24 hours
    await cacheClient.setKey(from, "1", "EX", 24 * 60 * 60);
  } else {
    //Increase the value of the from key, without affecting the ttl
    await cacheClient.incrValue(from);
  }

  return true;
};
