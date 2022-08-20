import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { BackHandler, Image, ImageBackground, ImageStyle, ImageURISource, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { BorderedImage } from "../../common/components/BorderedImage";
import { Logo } from "../../common/components/Logo";
import { ImageResources, SplashResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { user_picture } from "../../core/theme/themeDependencies";
import { RootStackParamList } from "../../navigation/RootNavigation";
import { logout } from "../login/loginSlice";

type Props = StackScreenProps<RootStackParamList, "Registration">;

export const RegistrationPage: React.FC<Props> = (props: Props) => {
  const profile = useAppSelector(state => state.entities.user);
  const dispatch = useAppDispatch();

  const { name, photo_url } = profile || { name: "", photo_url: "" };
  const picture: ImageURISource = photo_url ? { uri: photo_url } : user_picture(true);

  const toMainPage = () => {
    props.navigation.dispatch(goToMainPage);
  }

  useEffect(() => {
    return BackHandler.addEventListener("hardwareBackPress", () => {
      dispatch(logout());
      return false
    }).remove
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground source={SplashResources.splash} style={styles.background} resizeMode={"cover"}>
        <View style={styles.separatorContainer}>
          <Logo />
        </View>
        <View style={styles.separatorContainer}>
          <View style={styles.profileImageBox}>
            <Image source={ImageResources.user_border} style={styles.profileImageBorder} />
            <BorderedImage source={picture} borderRadius={100} style={styles.profileImage} />
          </View>
          <Text style={styles.buttonText}>{name}</Text>
        </View>
        <View style={styles.separatorContainer}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: "#C8D9AF" }]}
            onPress={toMainPage}
          >
            <Text style={styles.buttonText}>{localization.login.continue}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

const goToMainPage = (state: StackNavigationState<RootStackParamList>): CommonActions.Action => {
  const routes = [{ name: "MainPage" }];
  return CommonActions.reset({
    ...state,
    routes,
    index: 0
  })
}

const styles = styleSheetCreate({
  container: {
    flex: 1
  } as ViewStyle,
  background: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  separatorContainer: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  profileImageBox: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 80
  } as ViewStyle,
  profileImageBorder: {
    alignSelf: "center",
  } as ImageStyle,
  profileImage: {
    alignSelf: "center",
    position: "absolute",
    height: 128,
    width: 128
  } as ImageStyle,
  continueButton: {
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 5
  } as ViewStyle,
  buttonText: {
    color: "white",
    fontSize: 18,
    flex: 1,
    textAlign: "center"
  } as TextStyle
});