import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Image, View } from "react-native";
import { IconsResources } from "../common/ImageResources.g";
import { CommonStyles } from "../core/theme";
import { shopsHeader, tabOnTopStyle } from "../core/theme/navigation";
import { CoffeeShopsList } from "../modules/coffeeShops/coffeeShops";
import { Map } from "../modules/map/map"

export type ShopsStackParamList = {
  Map: undefined;
  ShopsList: undefined;
};

const Tabs = createMaterialTopTabNavigator<ShopsStackParamList>();

export const MapAndList: React.FC = () => {
  return (
    <View style={CommonStyles.flex1}>
      <Tabs.Navigator backBehavior="none" tabBar={shopsHeader} keyboardDismissMode={"on-drag"}>
        <Tabs.Screen
          name="Map"
          component={Map}
          options={{ tabBarIcon: mapIcon, swipeEnabled: false, lazy: false, tabBarStyle: tabOnTopStyle }} 
        />
        <Tabs.Screen
          name="ShopsList"
          component={CoffeeShopsList}
          options={{ tabBarIcon: listIcon, lazy: false }}
        />
      </Tabs.Navigator>
    </View>
  )
}

const mapIcon = (): React.ReactNode => {
  return (
    <Image source={IconsResources.icon_map} />
  )
}

const listIcon = (): React.ReactNode => {
  return (
    <Image source={IconsResources.icon_list} />
  )
}