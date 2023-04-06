import { Request, Response } from "express";
import { OK } from "../constants/httpConstants";

export class HealthCheckController {
  public async healthCheck(_req: Request, res: Response) {
    res.status(OK).json({ status: 1 });
  }
}
