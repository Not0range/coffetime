import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, ImageStyle, KeyboardAvoidingView, Modal, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";
import { ButtonWithIcon } from "../../common/components/ButtonWithIcon";
import { LoadingModal } from "../../common/components/LoadingModal";
import { Logo } from "../../common/components/Logo";
import { IconsResources, SplashResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { facebookLoginUrl } from "../../core/api/facebookAPI";
import { vkLoginUrl } from "../../core/api/vkAPI";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles } from "../../core/theme";
import { RootStackParamList } from "../../navigation/RootNavigation";
import { getProfileAsync } from "../entities/entitiesSlice";
import { login, LoginType } from "./loginSlice";

type Props = StackScreenProps<RootStackParamList, "Login">;

export const LoginPage: React.FC<Props> = (props: Props) => {
  const [url, setUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { type, token, expired } = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (type == "guest" || type != "none" && token && expired * 1000 > Date.now())
      props.navigation.dispatch(goToMainPage);
    setLoading(false);
  }, []);

  const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
    const url = newNavState.url;
    if (!url) return;
    if (url.startsWith("https://www.facebook.com/connect/login_success.html")) {
      setModalVisible(false);
      setUrl("");
      const { token, expired } = extractParams(url);
      if (token) {
        dispatch(login({
          type: LoginType.facebook,
          token: token,
          expired
        }));
        dispatch(getProfileAsync({ token, type: LoginType.facebook }));
        props.navigation.navigate("Registration");
      }//todo error handling
    }
    else if (url.startsWith("https://oauth.vk.com/blank.html")) {
      setModalVisible(false);
      setUrl("");
      const { token, expired } = extractParams(url);
      if (token) {
        dispatch(login({
          type: LoginType.vk,
          token: token,
          expired
        }));
        dispatch(getProfileAsync({ token, type: LoginType.vk }));
        props.navigation.navigate("Registration");
      }//todo error handling
    }
  }

  const openFacebookLogin = () => {
    setModalVisible(true);
    setUrl(facebookLoginUrl);
  }

  const openVKLogin = () => {
    setModalVisible(true);
    setUrl(vkLoginUrl);
  }

  const guestLogin = () => {
    dispatch(login({
      type: LoginType.guest,
      token: "",
      expired: 0
    }));
    props.navigation.dispatch(goToMainPage);
  }

  const modalClose = () => {
    setModalVisible(false);
    setUrl("");
  }

  return (
    <View style={CommonStyles.flex1}>
      <Modal visible={modalVisible} onRequestClose={modalClose} transparent={true} animationType={"fade"}>
        <TouchableOpacity onPress={modalClose} style={styles.modalBackground} />
        <View style={styles.modal}>
          <WebView
            automaticallyAdjustContentInsets={false}
            source={{ uri: url }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            javaScriptEnabled={false}
            incognito={true}
          />
        </View>
      </Modal>
      <LoadingModal isLoading={loading} />

      <ImageBackground source={SplashResources.splash} style={styles.background} resizeMode={"cover"}>
        <View style={styles.separatorContainer}>
          <Logo />
        </View>
        <View style={styles.separatorContainer} />
        <View style={styles.separatorContainer}>
          <ButtonWithIcon
            icon={IconsResources.icon_facebook}
            text={localization.login.loginViaFacebook}
            style={[styles.loginButton, styles.facebookButton]}
            onPress={openFacebookLogin}
          />
          <ButtonWithIcon
            icon={IconsResources.icon_vk}
            text={localization.login.loginViaVK}
            style={[styles.loginButton, styles.vkButton]}
            onPress={openVKLogin}
          />
          <ButtonWithIcon
            text={localization.login.loginAsGuest}
            style={[styles.loginButton, styles.guestButton]}
            onPress={guestLogin}
          />
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

const extractParams = (url: string): { token: string, expired: number } => {
  const token = (url.match(/access_token=([^&]+)/) || ["", ""])[1];
  const expires_in = +(url.match(/expires_in=([^&]+)/) || ["0", "0"])[1];
  if (token && !isNaN(expires_in))
    return { token, expired: moment().add(expires_in, "second").unix() }
  return { token: "", expired: 0 }
}

const styles = styleSheetCreate({
  modal: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    flex: 1
  } as ViewStyle,
  modalBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light_gray,
    opacity: 0.7,
  } as ViewStyle,
  background: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  } as ViewStyle,
  separatorContainer: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  loginButton: {
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 5,
    backgroundColor: Colors.facebook
  } as ViewStyle,
  facebookButton: {
    backgroundColor: Colors.facebook
  } as ViewStyle,
  vkButton: {
    backgroundColor: Colors.vk
  } as ViewStyle,
  guestButton: {
    backgroundColor: Colors.light_gray,
  } as ViewStyle,
});