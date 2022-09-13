import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { CommonActions, StackNavigationState } from "@react-navigation/native"
import { StackNavigationOptions } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { ImageResources } from "../../common/ImageResources.g"
import { styleSheetCreate } from "../../common/utils"
import { RootStackParamList } from "../../navigation/RootNavigation"
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
  },
  headerBackImage: () => <Image source={ImageResources.image_back} />
}

export const shopsHeader = ({ state, descriptors, navigation }: MaterialTopTabBarProps): React.ReactNode => {
  const [style, setStyle] = useState<ViewStyle>({});

  useEffect(() => {
    const s = descriptors[state.routes[state.index].key].options?.tabBarStyle;
    if (s)
      setStyle((s as ViewStyle));
    else
      setStyle({})
  }, [state.index]);
  return (
    <View style={[tabStyles.container, style]}>
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
            };

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
    </View>
  )
}

export const tabOnTopStyle = {
  position: "absolute",
  zIndex: 2,
} as ViewStyle;

export const tabCommonStyle = {
  backgroundColor: Colors.white,
  width: "100%"
} as ViewStyle;

const tabStyles = styleSheetCreate({
  container: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "center",
    alignSelf: "center",
  } as ViewStyle,
  tabContainer: {
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 2
  } as ViewStyle,
  tabView: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    paddingVertical: 3
  } as ViewStyle,
  tabButton: {
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 4
  } as ViewStyle
})