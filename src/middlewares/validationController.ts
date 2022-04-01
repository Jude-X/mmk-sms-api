import { validatorService } from "../services/validator.service";
import { Context, Next } from "koa";

export const validation = async (
  ctx: Context,
  next: Next
): Promise<void | Context> => {
  try {
    await validatorService(ctx.request.body);
    return next();
  } catch (err: any) {
    let failMessage = err.message;
    ctx.status = 400;

    ctx.body = { message: "", error: failMessage };
    return ctx;
  }
};
