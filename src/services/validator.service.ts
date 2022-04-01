/* eslint-disable @typescript-eslint/no-explicit-any */

export const validatorService = async (body: any): Promise<any> => {
  let from = body && body.from;
  let to = body && body.to;
  let text = body && body.text;

  if (!from) {
    throw new Error("from is missing");
  }

  if (from.length < 6 || from.length > 16) {
    throw new Error("from is invalid");
  }

  if (!to) {
    throw new Error("to is missing");
  }

  if (to.length < 6 || to.length > 16) {
    throw new Error("to is invalid");
  }

  if (!text) {
    throw new Error("text is missing");
  }

  if (text.length < 1 || text.length > 120) {
    throw new Error("text is invalid");
  }

  return;
};
