import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { AppRouter } from "./routes/AppRouter";
import { IAppProvider } from "./providers/IAppProvider";
import { initSwaggerDocs } from "./docs/swagger";

type PrismaError = {
  code: string;
  meta: {
    target?: string[];
    [key: string]: any;
  };
  message: string;
};

function convertPrismaErrorToUserFriendly(prismaError: PrismaError): string {
  let userFriendlyMessage = prismaError.message;
  console.log("primsa code", prismaError.code);
  switch (prismaError.code) {
    case "P2000":
      userFriendlyMessage = `The value provided for '${prismaError.meta.target?.join(
        ", "
      )}' is too long.`;
      break;
    case "P2001":
      userFriendlyMessage = "The record you are looking for does not exist.";
      break;
    case "P2002":
      userFriendlyMessage = "The value you provided is not unique.";
      break;
    case "P2003":
      userFriendlyMessage = "The linked record doesn't exist.";
      break;
    case "P2004":
      userFriendlyMessage = "There was a constraint error on the database.";
      break;
    case "P2005":
      userFriendlyMessage = "The value stored in the database is invalid.";
      break;
    case "P2006":
      userFriendlyMessage = "The provided value is not valid.";
      break;
    case "P2007":
      userFriendlyMessage = "There was a data validation error.";
      break;
    case "P2008":
      userFriendlyMessage = "Failed to parse the query.";
      break;
    case "P2009":
      userFriendlyMessage = "Failed to validate the query.";
      break;
    case "P2010":
      userFriendlyMessage = "Raw query failed.";
      break;
    case "P2011":
      userFriendlyMessage = `Please provide a value for '${prismaError.meta.target?.join(
        ", "
      )}'.`;
      break;
    case "P2012":
      userFriendlyMessage = "Missing a required value.";
      break;
    case "P2013":
      userFriendlyMessage = `Missing the required argument for field '${prismaError.meta.target?.join(
        ", "
      )}'.`;
      break;
    case "P2014":
      userFriendlyMessage =
        "The change you are trying to make would violate the relation.";
      break;
    case "P2015":
      userFriendlyMessage = "A related record could not be found.";
      break;
    case "P2016":
      userFriendlyMessage = "There was an error interpreting the query.";
      break;
    case "P2017":
      userFriendlyMessage = "The records for relation are not connected.";
      break;
    case "P2018":
      userFriendlyMessage = "The required connected records were not found.";
      break;
    case "P2019":
      userFriendlyMessage = "There was an input error.";
      break;
    case "P2020":
      userFriendlyMessage = "The value provided is out of range.";
      break;
    case "P2021":
      userFriendlyMessage = `The table '${prismaError.meta.target?.join(
        ", "
      )}' doesn't exist.`;
      break;
    case "P2022":
      userFriendlyMessage = `The field '${prismaError.meta.target?.join(
        ", "
      )}' doesn't exist.`;
      break;
    case "P2023":
      userFriendlyMessage = "Inconsistent column data.";
      break;
    case "P2024":
      userFriendlyMessage = "Connection to the database timed out.";
      break;
    case "P2025":
      userFriendlyMessage =
        "An operation failed because a required record was not found.";
      break;
    case "P2026":
      userFriendlyMessage =
        "The current database provider doesn't support a feature that the query used.";
      break;
    case "P2027":
      userFriendlyMessage =
        "Multiple errors occurred on the database during query execution.";
      break;
    case "P2028":
      userFriendlyMessage = "Transaction API error.";
      break;
    case "P2030":
      userFriendlyMessage =
        "Cannot find a fulltext index to use for the search, consider updating your schema.";
      break;
    case "P2031":
      userFriendlyMessage =
        "Your MongoDB server needs to be run as a replica set for Prisma to perform transactions.";
      break;
    case "P2033":
      userFriendlyMessage =
        "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers.";
      break;
    case "P2034":
      userFriendlyMessage =
        "Transaction failed due to a write conflict or a deadlock. Please retry your transaction.";
      break;
  }
  return userFriendlyMessage;
}

export class App {
  private readonly app: Express;
  private readonly port: number;
  private router: AppRouter;

  constructor(app: Express, port: number, appProvider: IAppProvider) {
    this.app = app;
    this.port = port;
    this.router = appProvider.getAppRouter();
    this.initMiddleware();
    this.initRoutes();
    this.app.use(
      (
        err: { message: string; code?: number; meta?: any },
        req: Request,
        res: Response,
        next: NextFunction // esencial que tenga este parametro y no lo use -NO BORRAR
      ) => {
        const error: any = err;
        error.code = err.code || 500;
        error.status = "error";
        return res.status(error.code).json({
          status: error.status,
          message: (err as any).meta
            ? convertPrismaErrorToUserFriendly(error as PrismaError)
            : err.message,
          fields: (err as any).meta ?? undefined,
          fullMessage: err.message,
        });
      }
    );

    this.app.get("/", (_req, res) => {
      res.send("Hello World!");
    });
  }

  public startListening() {
    this.app.listen(this.port, () => {
      console.log(`User Service listening on port ${this.port} :)`);
    });
  }

  private initRoutes() {
    this.router.initRoutes(this.app);
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("common"));
    initSwaggerDocs(this.app, this.port);
  }
}
