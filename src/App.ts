import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { AppRouter } from "./routes/AppRouter";

export class App {
  private readonly app: Express;
  private readonly port: number;
  private router: AppRouter;

  constructor(app: Express, port: number, router: AppRouter) {
    this.app = app;
    this.port = port;
    this.router = router;
    this.initMiddleware();
    this.initRoutes();
  }

  public startListening() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
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
