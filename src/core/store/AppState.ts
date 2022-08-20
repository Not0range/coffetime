import { ISystemState, SystemInitialState } from "./systemSlice";
import { IEntitiesState, EntitiesInitialState } from "../../modules/entities/entitiesSlice";
import { ILoginState, LoginInitialState } from "../../modules/login/loginSlice";

export interface IAppState {
  system: ISystemState;
  entities: IEntitiesState;
  login: ILoginState
}

export function getAppInitialState(): IAppState {
  return {
    system: SystemInitialState,
    entities: EntitiesInitialState,
    login: LoginInitialState
  };
}