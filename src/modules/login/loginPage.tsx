import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Keyboard, KeyboardAvoidingView, ScrollView, TextInput, TouchableWithoutFeedback, useWindowDimensions, View, ViewStyle } from "react-native";
import { AuthTextInput } from "../../common/components/AuthTextInput";
import { LoadingModal } from "../../common/components/LoadingModal";
import { Logo } from "../../common/components/Logo";
import { MainButton } from "../../common/components/MainButton";
import { ButtonType } from "../../common/enums/buttonType";
import { IconsResources, SplashResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles } from "../../core/theme";
import { RootStackParamList } from "../../navigation/RootNavigation";
import { IAuthParams, loginAsync, resetError } from "./loginSlice";
import DevMenu from "react-native-dev-menu";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";

type Props = StackScreenProps<RootStackParamList, "Login">;

export const LoginPage: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureEnabled, setIsSecureEnabled] = useState(true);
  const passwordRef = useRef<TextInput>(null);
  const [loginPromise, setLoginPromise] = useState<any>(null);

  const { loading: loadingState, errorSource } = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (__DEV__) {
      DevMenu.addItem(
        "Navigate To Playground",
        () => props.navigation.navigate("Playground"),
      );
    }
  }, []);

  const onInputForPasswordSubmit = (): void => {
    passwordRef.current?.focus();
  };

  const passwordIconPress = () => {
    setIsSecureEnabled(!isSecureEnabled);
  }

  const login = () => {
    Keyboard.dismiss();
    const promise = dispatch(loginAsync({ email, password }));
    setLoginPromise(promise);

    promise.then(result => {
      if (result.meta.requestStatus == "fulfilled")
        props.navigation.dispatch(goToMainPage);
      else
        Toast.show((result.payload as IAuthParams).error);
    });
  };

  const registration = () => {
    dispatch(resetError());
    props.navigation.navigate("Registration");
  };

  const cancelLogin = () => {
    loginPromise.abort();
  };

  const { width, height } = useWindowDimensions();

  const scrollStyle: ViewStyle = {
    height,
    width
  };

  return (
    <ScrollView contentContainerStyle={scrollStyle}>
      <LoadingModal isLoading={loadingState} onPress={cancelLogin} onRequestClose={cancelLogin} />

      <ImageBackground source={SplashResources.splash} style={styles.background} resizeMode={"cover"}>
        <LinearGradient start={{x: 0, y: 0.88}} end={{x: 0, y: 1}} colors={[Colors.transparent, Colors.loginGradient]} style={CommonStyles.flex1}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={CommonStyles.flex1}>
              <View style={styles.separatorContainer}>
                <Logo />
              </View>
              <KeyboardAvoidingView style={styles.loginContainer}>
                <AuthTextInput
                  label={localization.login.email}
                  containerStyle={styles.input}
                  keyboardType={"email-address"}
                  value={email}
                  onChangeText={setEmail}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType={"next"}
                  onSubmitEditing={onInputForPasswordSubmit}
                  blurOnSubmit={false}
                  isError={errorSource == "email" || errorSource == "both"}
                />
                <AuthTextInput
                  inputRef={passwordRef}
                  label={localization.login.password}
                  containerStyle={styles.input}
                  keyboardType={"default"}
                  value={password}
                  spellCheck={false}
                  onChangeText={setPassword}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType={"done"}
                  onSubmitEditing={login}
                  blurOnSubmit={false}
                  secureTextEntry={isSecureEnabled}
                  icon={isSecureEnabled ? IconsResources.icon_eye : IconsResources.icon_eye_non}
                  onIconPress={passwordIconPress}
                  isError={errorSource == "password" || errorSource == "both"}
                />
                <MainButton
                  type={ButtonType.Action}
                  title={localization.login.login}
                  style={styles.button}
                  onPress={login}
                />
                <MainButton
                  type={ButtonType.Action}
                  title={localization.login.registration}
                  style={styles.button}
                  onPress={registration}
                />
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </ImageBackground>
    </ScrollView>
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
  background: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    overflow: "scroll"
  } as ViewStyle,
  separatorContainer: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  loginContainer: {
    flex: 3,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  button: {
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 30
  } as ViewStyle,
  input: {
    marginHorizontal: 16,
    marginTop: 30,
    paddingHorizontal: 4,
    backgroundColor: Colors.white88,
    borderRadius: 10
  } as ViewStyle
});