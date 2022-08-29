import { DrawerContentComponentProps, DrawerNavigationOptions } from "@react-navigation/drawer"
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { CommonActions, StackNavigationState } from "@react-navigation/native"
import { StackHeaderProps, StackNavigationOptions, StackNavigationProp } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { ProfileHeader } from "../../common/components/ProfileHeader"
import { localization } from "../../common/localization/localization"
import { styleSheetCreate } from "../../common/utils"
import { LoginType, logout } from "../../modules/login/loginSlice"
import { RootStackParamList } from "../../navigation/RootNavigation"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { Colors } from "./colors"
import { CommonStyles } from "./commonStyles"
import { Fonts } from "./fonts"

export const headerOptions: StackNavigationOptions = {
  headerTitle: "CoffeTime",
  headerTitleAlign: "center",
  headerTitleStyle: {
    margin: 8,
    fontFamily: Fonts.lobster,
    fontSize: 22
  }
}

interface HeaderStyle {
  position: "absolute" | "relative";
  zIndex: 0
}

const goToLoginPage = (state: StackNavigationState<RootStackParamList>): CommonActions.Action => {
  const routes = [{ name: "Login" }];

  return CommonActions.reset({
    ...state,
    routes,
    index: 0
  })
}

export const drawerContent = ({ state, descriptors, navigation }: DrawerContentComponentProps): React.ReactNode => {
  const { type } = useAppSelector(state => state.login)
  const dispatch = useAppDispatch();
  const logoutPress = () => {
    (navigation.getParent() as StackNavigationProp<RootStackParamList, "MainPage", undefined>).dispatch(goToLoginPage);
    dispatch(logout());
  }
  return (
    <View style={drawerStyles.container}>
      <ProfileHeader />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const color = isFocused ? Colors.normal : "transparent";

        const onPress = () => {
          navigation.closeDrawer();
          if (!isFocused) {
            navigation.navigate({ name: route.name, params: {}, merge: true });
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={[drawerStyles.button, { backgroundColor: color }]}
            onPress={onPress}
          >
            <Text>{options.title}</Text>
          </TouchableOpacity>
        )
      })}
      <TouchableOpacity style={drawerStyles.button} onPress={logoutPress}>
        <Text>{type == LoginType.guest ? localization.login.login : localization.login.logout}</Text>
      </TouchableOpacity>
    </View>
  )
}

const drawerStyles = styleSheetCreate({
  container: {
    flex: 1,
    padding: 12
  } as ViewStyle,
  button: {
    padding: 12,
    borderRadius: 10
  } as ViewStyle
})

export const shopsHeader = ({ state, descriptors, navigation }: MaterialTopTabBarProps): React.ReactNode => {
  const [style, setStyle] = useState<HeaderStyle>({
    position: "relative",
    zIndex: 0
  });

  useEffect(() => {
    const s = descriptors[state.routes[state.index].key].options?.tabBarStyle;
    if (s)
      setStyle(s as HeaderStyle);
    else
      setStyle({
        position: "relative",
        zIndex: 0
      });
  }, [state.index]);
  return (
    <View style={[tabStyles.container, style]}>
      <View style={CommonStyles.flex1} />
      <View style={tabStyles.tabContainer}>
        <View style={tabStyles.tabView}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const color = isFocused ? Colors.normal : "transparent";
            const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color }) : (<View />)

            const onPress = () => {
              if (!isFocused) {
                navigation.navigate({ name: route.name, params: {}, merge: true });
              }
            }

            return (
              <TouchableOpacity
                key={route.key}
                style={[tabStyles.tabButton, { backgroundColor: color }]}
                onPress={onPress}
              >
                {icon}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={CommonStyles.flex1} />
    </View>
  )
}

export const tabOnTopStyle = {
  position: "absolute",
  zIndex: 2
} as ViewStyle

const tabStyles = styleSheetCreate({
  container: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 16
  } as ViewStyle,
  tabContainer: {
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 2
  } as ViewStyle,
  tabView: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center"
  } as ViewStyle,
  tabButton: {
    borderRadius: 30,
    paddingHorizontal: 16
  } as ViewStyle
})