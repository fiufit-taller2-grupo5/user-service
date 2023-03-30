import { Request, Response } from "express";
import { OK } from "../constants/http";

export class HealthCheckContrller {
  public async healthCheck(_req: Request, res: Response) {
    res.status(OK).json({ status: 1 });
  }
}
