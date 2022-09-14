import { ISystemState, SystemInitialState } from "./systemSlice";
import { IEntitiesState, EntitiesInitialState } from "../../modules/entities/entitiesSlice";
import { ILoginState, LoginInitialState } from "../../modules/login/loginSlice";
import { CafeInitialState, ICafeState } from "../../modules/cafes/cafeSlice";
import { CurrentCafeInitialState, ICurrentCafeState } from "../../modules/currentCafe/currentCafeSlice";
import { CurrentDrinkInitialState, ICurrentDrinkState } from "../../modules/currentDrink/currentDrinkSlice";
import { FavoriteDrinksInitialState, IFavoriteDrinksState } from "../../modules/favoritesDrinks/favoriteDrinksSlice";
import { IOrderState, OrderInitialState } from "../../modules/order/orderSlice";

export interface IAppState {
  system: ISystemState;
  entities: IEntitiesState;
  login: ILoginState;
  cafes: ICafeState;
  currentCafe: ICurrentCafeState;
  currentDrink: ICurrentDrinkState;
  favoriteDrinks: IFavoriteDrinksState;
  order: IOrderState;
}

export function getAppInitialState(): IAppState {
  return {
    system: SystemInitialState,
    entities: EntitiesInitialState,
    login: LoginInitialState,
    cafes: CafeInitialState,
    currentCafe: CurrentCafeInitialState,
    currentDrink: CurrentDrinkInitialState,
    favoriteDrinks: FavoriteDrinksInitialState,
    order: OrderInitialState
  };
}