import React from "react";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./RootNavigation";
import { MapAndList } from "./MapAndShopsNavigation";
import { headerOptions } from "../core/theme/navigation";
import { localization } from "../common/localization/localization";
import { View } from "react-native";
import { CommonStyles } from "../core/theme";
import { TestPage } from "../modules/test/test";
import { FavoritesDrinks } from "../modules/favoritesDrinks/favoritesDrinks";

type Props = StackScreenProps<RootStackParamList, "MainPage">;

export type MainStackParamList = {
  MapAndList: undefined;
  Drinks: undefined;
  Test: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainPage: React.FC<Props> = (props: Props) => {
  return (
    <View style={CommonStyles.flex1}>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name={"MapAndList"} component={MapAndList} options={{ title: localization.pages.coffeeShops }} />
        <Stack.Screen name={"Drinks"} component={FavoritesDrinks} options={{ title: localization.pages.favoritesDrinks }} />
        <Stack.Screen name={"Test"} component={TestPage} options={{ title: "Test" }} />
      </Stack.Navigator>
    </View>
  )
}