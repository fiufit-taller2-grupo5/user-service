import { Request, Response } from "express";
import { UserController } from "../../src/controllers/UserController";
import { OK } from "../../src/constants/http";

describe("UserController", () => {
  let req: Request;
  let res: Response;
  let unit: UserController;

  beforeEach(() => {
    res = {} as unknown as Response;
    res.json = jest.fn(() => res);
    res.status = jest.fn((statusCode) => {
      res.statusCode = statusCode;
      return res;
    });

    unit = new UserController();
  });
});
