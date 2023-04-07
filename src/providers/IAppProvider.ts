import { IUserDal } from "../dal/IUserDal";
import { AppRouter } from "../routes/AppRouter";

export interface IAppProvider {
  getAppRouter(): AppRouter;
  getUserDal(): IUserDal;
}
