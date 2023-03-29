import { Request, Response } from 'express';

export class HealthCheckContrller {
  public healthCheck(req: Request, res: Response) {
    res.send({ status: 200 });
  }
}
