import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./RootNavigation";
import { MapAndList } from "./MapAndShopsNavigation";
import { drawerContent, headerOption } from "../core/theme/navigation";
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

const Drawer = createDrawerNavigator<MainStackParamList>();

export const MainPage: React.FC<Props> = (props: Props) => {
  return (
    <View style={CommonStyles.flex1}>
      <Drawer.Navigator screenOptions={headerOption} backBehavior="none" drawerContent={drawerContent}>
        <Drawer.Screen name={"MapAndList"} component={MapAndList} options={{ title: localization.pages.coffeeShops }} />
        <Drawer.Screen name={"Drinks"} component={FavoritesDrinks} options={{ title: localization.pages.favoritesDrinks }} />
        <Drawer.Screen name={"Test"} component={TestPage} options={{ title: "Test" }} />
      </Drawer.Navigator>
    </View>
  )
}