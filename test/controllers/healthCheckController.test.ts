import { Request, Response } from "express";
import { HealthCheckContrller } from "../../src/controllers/HealthCheckController";
import { OK } from "../../src/constants/http";

describe("HealthCheckController", () => {
  let req: Request;
  let res: Response;
  let unit: HealthCheckContrller;

  beforeEach(() => {
    res = {} as unknown as Response;
    res.json = jest.fn(() => res);
    res.status = jest.fn((statusCode) => {
      res.statusCode = statusCode;
      return res;
    });

    unit = new HealthCheckContrller();
  });

  describe("getAllUsers", () => {
    it("Should return an empty array of users", async () => {
      await unit.healthCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith({ status: 1 });
    });
  });
});
