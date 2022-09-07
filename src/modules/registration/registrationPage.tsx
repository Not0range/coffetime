import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ImageBackground, Keyboard, TextInput, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
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
import { IAuthParams, registerAsync, resetError } from "../login/loginSlice";

type Props = StackScreenProps<RootStackParamList, "Registration">;

export const RegistrationPage: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureEnabled, setIsSecureEnabled] = useState(true);
  const passwordRef = useRef<TextInput>(null);

  const { loading, errorSource } = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  const onInputForPasswordSubmit = (): void => {
    passwordRef.current?.focus();
  };

  const passwordIconPress = () => {
    setIsSecureEnabled(!isSecureEnabled);
  };

  const register = () => {
    Keyboard.dismiss();
    dispatch(registerAsync({ email, password }))
    .then(result => {
      if (result.meta.requestStatus == "fulfilled")
        props.navigation.dispatch(goToMainPage);
      else
        Alert.alert(localization.errors.error, (result.payload as IAuthParams).error);
    });
  };

  const goBack = () => {
    dispatch(resetError());
    props.navigation.goBack();
  }

  return (
    <View style={CommonStyles.flex1}>
      <LoadingModal isLoading={loading} />

      <ImageBackground source={SplashResources.splash} style={styles.background} resizeMode={"cover"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={CommonStyles.flex1}>
            <View style={styles.separatorContainer}>
              <Logo />
            </View>
            <View style={styles.loginContainer}>
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
                onSubmitEditing={register}
                blurOnSubmit={false}
                secureTextEntry={isSecureEnabled}
                icon={isSecureEnabled ? IconsResources.icon_eye : IconsResources.icon_eye_non}
                onIconPress={passwordIconPress}
                isError={errorSource == "password" || errorSource == "both"}
              />
              <MainButton
                type={ButtonType.Action}
                title={localization.login.signUp}
                style={styles.button}
                onPress={register}
              />
              <MainButton
                type={ButtonType.Action}
                title={localization.common.back}
                style={styles.button}
                onPress={goBack}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  )
};

const goToMainPage = (state: StackNavigationState<RootStackParamList>): CommonActions.Action => {
  const routes = [{ name: "MainPage" }];
  return CommonActions.reset({
    ...state,
    routes,
    index: 0
  })
};

const styles = styleSheetCreate({
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