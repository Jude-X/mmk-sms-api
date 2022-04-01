import { Context, Next } from "koa";
import { authService } from "../services/auth.service";

export const auth = async (
  ctx: Context,
  next: Next
): Promise<void | Context> => {
  try {
    const resp = await authService(ctx.headers);
    ctx.request.body.accountId = resp;

    return next();
  } catch (err: any) {
    let failMessage = "unknown failure";
    ctx.status = 500;

    if (err.message === "Unauthorized") {
      failMessage = "Unauthorized";
      ctx.status = 403;
    }

    ctx.body = { message: "", error: failMessage };
    return ctx;
  }
};
