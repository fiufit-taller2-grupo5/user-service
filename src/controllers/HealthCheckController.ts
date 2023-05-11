import { Request, Response } from "express";
import { OK_CODE } from "../constants/httpConstants";

export class HealthCheckController {
  public async healthCheck(_req: Request, res: Response) {
    res.status(OK_CODE).json({ status: 1 });
  }
}
