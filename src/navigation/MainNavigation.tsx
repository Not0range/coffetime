import React from "react";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./RootNavigation";
import { MapAndList } from "./MapAndListNavigation";
import { headerOptions } from "../core/theme/navigation";
import { localization } from "../common/localization/localization";
import { View } from "react-native";
import { CommonStyles } from "../core/theme";
import { FavoriteDrinksPage } from "../modules/favoritesDrinks/favoriteDrinksPage";
import { CurrentCafePage } from "../modules/currentCafe/currentCafePage";
import { CurrentDrinkPage } from "../modules/currentDrink/currentDrinkPage";

type Props = StackScreenProps<RootStackParamList, "MainPage">;

export type MainStackParamList = {
  MapAndList: undefined;
  FavoriteDrinks: undefined;
  CurrentCafe: undefined;
  CurrentDrink: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainPage: React.FC<Props> = (props: Props) => {
  return (
    <View style={CommonStyles.flex1}>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name={"MapAndList"} component={MapAndList} options={{ title: localization.pages.coffeeShops }} />
        <Stack.Screen name={"FavoriteDrinks"} component={FavoriteDrinksPage} options={{ title: localization.pages.favoritesDrinks }} />
        <Stack.Screen name={"CurrentCafe"} component={CurrentCafePage} options={{ title: localization.pages.currentCafe }} />
        <Stack.Screen name={"CurrentDrink"} component={CurrentDrinkPage} options={{ title: localization.pages.currentDrink }} />
      </Stack.Navigator>
    </View>
  )
}