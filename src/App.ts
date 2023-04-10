import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { AppRouter } from "./routes/AppRouter";
import { IAppProvider } from "./providers/IAppProvider";

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

    this.app.get("/", (_req, res) => {
      res.send("Hello World!");
    });
  }

  public startListening() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port} :)`);
    });
  }

  private initRoutes() {
    this.router.initRoutes(this.app);
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("common"));
  }
}
