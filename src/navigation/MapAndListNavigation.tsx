import { HeaderBackButton } from "@react-navigation/elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Alert, AlertButton, BackHandler, Image, ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { IconsResources, ImageResources } from "../common/ImageResources.g";
import { localization } from "../common/localization/localization";
import { styleSheetCreate } from "../common/utils";
import { useAppDispatch } from "../core/store/hooks";
import { CommonStyles } from "../core/theme";
import { shopsHeader, tabCommonStyle, tabOnTopStyle } from "../core/theme/navigation";
import { heart_icon } from "../core/theme/themeDependencies";
import { CoffeeShopsList } from "../modules/cafes/cafeList";
import { logout } from "../core/store/systemSlice";
import { Map } from "../modules/map/map"
import { MainStackParamList } from "./MainNavigation";
import { RootStackParamList } from "./RootNavigation";

type Props = StackScreenProps<MainStackParamList, "MapAndList">;

export type ShopsStackParamList = {
  Map: undefined;
  ShopsList: undefined;
};

const Tabs = createMaterialTopTabNavigator<ShopsStackParamList>();

export const MapAndList: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const goToFavorite = () => props.navigation.navigate("FavoriteDrinks");
  const headerRight = () => (
    <TouchableOpacity onPress={goToFavorite} style={styles.button}>
      <Image source={heart_icon()} style={styles.icon} />
    </TouchableOpacity>
  );
  
  const logoutPress = () => {
    dispatch(logout());
    (props.navigation.getParent() as StackNavigationProp<RootStackParamList, "MainPage", undefined>).dispatch(goToLoginPage);
  }
  const buttons: AlertButton[] = [{
    text: localization.common.closeApp,
    onPress: BackHandler.exitApp
  }, {
    text: localization.login.logout,
    style: "destructive",
    onPress: logoutPress
  },
  {
    text: localization.common.cancel,
    style: "cancel"
  }];
  const goBack = () => Alert.alert(localization.common.warning, localization.common.exitQuestion, buttons);
  const headerLeft = () => (
    <HeaderBackButton onPress={goBack} backImage={() => <Image source={ImageResources.image_back} />} />
  )
  useEffect(() => {
    props.navigation.setOptions({ headerLeft, headerRight });
  }, []);

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
          options={{ tabBarIcon: listIcon, lazy: false, tabBarStyle: tabCommonStyle }}
        />
      </Tabs.Navigator>
    </View>
  )
}

const styles = styleSheetCreate({
  icon: {
    height: 24,
    width: 24
  } as ImageStyle,
  button: {
    margin: 8
  } as ViewStyle,
});

const goToLoginPage = (state: StackNavigationState<RootStackParamList>): CommonActions.Action => {
  const routes = [{ name: "Login" }];

  return CommonActions.reset({
    ...state,
    routes,
    index: 0
  })
};

const mapIcon = (): React.ReactNode => {
  return (
    <Image source={IconsResources.icon_map} />
  )
};

const listIcon = (): React.ReactNode => {
  return (
    <Image source={IconsResources.icon_list} />
  )
};