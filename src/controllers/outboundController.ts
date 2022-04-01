import { outboundService } from "../services/outbound.service";
import { Context, Next } from "koa";

export const outbound = async (
  ctx: Context,
  next: Next
): Promise<void | Context> => {
  console.log("Start - Handle outbound request");

  try {
    await outboundService(ctx.request.body);
    ctx.status = 201;
    ctx.body = {
      message: "outbound sms ok",
      error: "",
    };
  } catch (err: any) {
    let failMessage = "unknown failure";
    ctx.status = 500;

    if (err.message === "from parameter not found") {
      failMessage = "from parameter not found";
      ctx.status = 422;
    }

    if (err.message.indexOf("blocked by STOP request") >= 0) {
      failMessage = err.message;
      ctx.status = 422;
    }

    if (err.message.indexOf("limit reached for from") >= 0) {
      failMessage = err.message;
      ctx.status = 422;
    }

    ctx.body = { message: "", error: failMessage };
  }
  console.log("End - Handle outbound request");
  return ctx;
};
