import { Request, Response } from "express";
import { HealthCheckController } from "../../src/controllers/HealthCheckController";
import { OK } from "../../src/constants/httpConstants";

describe("HealthCheckController", () => {
  let req: Request;
  let res: Response;
  let unit: HealthCheckController;

  beforeEach(() => {
    res = {} as unknown as Response;
    res.json = jest.fn(() => res);
    res.status = jest.fn((statusCode: number) => {
      res.statusCode = statusCode;
      return res;
    });

    unit = new HealthCheckController();
  });

  describe("getAllUsers", () => {
    it("Should return an empty array of users", async () => {
      await unit.healthCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith({ status: 1 });
    });
  });
});
