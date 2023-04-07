import { UserController } from "../../src/controllers/UserController";
import { Request, Response } from "express";
import { IUserDal } from "../../src/dal/IUserDal";

describe("UserController", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    res = {} as unknown as Response;
    res.json = jest.fn(() => res);
    res.status = jest.fn((statusCode: number) => {
      res.statusCode = statusCode;
      return res;
    });
  });

  describe("getAllUsers", () => {
    it("Should return an empty array of users if there are no users", async () => {
      const userDal: IUserDal = {
        findAll: jest.fn(async () => []),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      await unit.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: [] });
    });

    it("Should return an array of users if there are users", async () => {
      const usersArray = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@mail.com",
          state: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@mail.com",
          state: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "John Smith",
          email: "smith@mail.com",
          state: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const findAllUsersMock = async () => usersArray;

      const userDal: IUserDal = {
        findAll: jest.fn(findAllUsersMock),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      await unit.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        users: await findAllUsersMock(),
      });
    });
  });

  describe("getUserById", () => {
    it("Should return user if exists", async () => {
      const user = {
        id: 1,
        name: "John Doe",
        email: "doe@mail.com",
        state: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(async () => user),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      const req = { params: { id: "1" } } as unknown as Request;

      await unit.getUserById(req, res);

      const expected = {
        id: 1,
        name: "John Doe",
        email: "doe@mail.com",
        state: "ACTIVE",
      };

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expected);
    });
  });
});
