import { REHYDRATE } from "redux-persist/es/constants";
import { actionCreator } from "./actionCreator";
import { IAppState } from "./AppState";

export class CoreActions {
  static rehydrate = actionCreator<IAppState>(REHYDRATE);
}
