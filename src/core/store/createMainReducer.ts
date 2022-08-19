import { combineReducers } from "redux";
import entitiesReducer from "../../modules/entities/entitiesSlice";
import { IAppState } from "./AppState";
import { Reducers } from "./Reducers";
import systemReducer from "./systemSlice";
import loginReducer from "../../modules/login/loginSlice";

export function createMainReducer(): any {
  const reducers: Reducers<IAppState> = {
    system: systemReducer,
    entities: entitiesReducer,
    login: loginReducer
  };

  return combineReducers(reducers);
}