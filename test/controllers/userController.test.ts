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

    it("Should return 404 if user does not exist", async () => {
      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(async () => null),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      const req = { params: { id: "1" } } as unknown as Request;

      await unit.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("Should return 400 if id is not a number", async () => {
      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      const req = { params: { id: "notANumber" } } as unknown as Request;

      await unit.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    });
  });

  describe("createUser", () => {
    it("Should return 201 if user is created", async () => {
      const created = new Date();
      const updated = new Date();

      const user = {
        id: 1,
        name: "John Doe",
        email: "john@mail.com",
        state: "ACTIVE",
        createdAt: created,
        updatedAt: updated,
      };

      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(async () => {
          return user;
        }),
      };

      const unit = new UserController(userDal);

      const req = {
        body: {
          name: "John Doe",
          email: "john@mail.com",
        },
      } as unknown as Request;

      await unit.newUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "User John Doe with id 1 created",
      });
    });

    it("Should return 400 if name is not provided", async () => {
      const req = { body: {} } as unknown as Request;

      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      await unit.newUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("Should return a 409 if user already exists", async () => {
      const name = "johnodoe";
      const email = "doe@mail.com";
      const req = { body: { name, email } } as unknown as Request;

      const userDal: IUserDal = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(async (name) => {
          return {
            id: 1,
            name,
            email,
            state: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
        create: jest.fn(),
      };

      const unit = new UserController(userDal);

      await unit.newUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "User with name johnodoe already exists",
      });
    });
  });
});
