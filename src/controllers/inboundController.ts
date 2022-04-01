import { inboundService } from "../services/inbound.service";
import { Context, Next } from "koa";

export const inbound = async (
  ctx: Context,
  next: Next
): Promise<void | Context> => {
  console.log("Start - Handle inbound request");

  try {
    await inboundService(ctx.request.body);
    ctx.status = 201;
    ctx.body = {
      message: "inbound sms ok",
      error: "",
    };
  } catch (err: any) {
    console.log(err);
    let failMessage = "unknown failure";
    ctx.status = 500;

    if (err.message === "to parameter not found") {
      failMessage = "to parameter not found";
      ctx.status = 400;
    }

    ctx.body = { message: "", error: failMessage };
  }
  console.log("End - Handle inbound request");
  return ctx;
};
