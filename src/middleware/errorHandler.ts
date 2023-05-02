import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("Error handler called: ", err);
  console.log("req: ", req.url, req.method, req.body);
  console.log("res: ", res.statusCode);
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    console.error("Bad JSON: ", err), req.body;
    res.status(400).send({ message: "Malformed JSON" });
  } else {
    next(err);
  }
};
