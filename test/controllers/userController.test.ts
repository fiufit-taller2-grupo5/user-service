import { Request, Response } from "express";
import { UserController } from "../../src/controllers/UserController";

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

  describe("getAllUsers", () => {
    it("Should return an empty array of users", async () => {
      await unit.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: [] });
    });
  });
});
