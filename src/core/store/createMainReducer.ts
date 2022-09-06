import { combineReducers } from "redux";
import entitiesReducer from "../../modules/entities/entitiesSlice";
import { IAppState } from "./AppState";
import { Reducers } from "./Reducers";
import systemReducer from "./systemSlice";
import loginReducer from "../../modules/login/loginSlice";
import cafeReducer from "../../modules/cafes/cafeSlice";
import currentCafeReducer from "../../modules/currentCafe/currentCafeSlice";
import currentDrinkReducer from "../../modules/currentDrink/currentDrinkSlice";
import favoriteDrinksReducer from "../../modules/favoritesDrinks/favoriteDrinksSlice";

export function createMainReducer(): any {
  const reducers: Reducers<IAppState> = {
    system: systemReducer,
    entities: entitiesReducer,
    login: loginReducer,
    cafes: cafeReducer,
    currentCafe: currentCafeReducer,
    currentDrink: currentDrinkReducer,
    favoriteDrinks: favoriteDrinksReducer
  };

  return combineReducers(reducers);
}