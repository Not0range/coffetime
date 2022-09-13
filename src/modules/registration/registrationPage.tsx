import { CommonActions, StackNavigationState } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Image, ImageBackground, ImageStyle, Keyboard, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View, ViewStyle } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AuthTextInput } from "../../common/components/AuthTextInput";
import { BorderedImage } from "../../common/components/BorderedImage";
import { LoadingModal } from "../../common/components/LoadingModal";
import { Logo } from "../../common/components/Logo";
import { MainButton } from "../../common/components/MainButton";
import { ButtonType } from "../../common/enums/buttonType";
import { IconsResources, ImageResources, SplashResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles } from "../../core/theme";
import { user_picture } from "../../core/theme/themeDependencies";
import { RootStackParamList } from "../../navigation/RootNavigation";
import { IAuthParams, registerAsync, resetError } from "../login/loginSlice";
import Toast from "react-native-simple-toast";

type Props = StackScreenProps<RootStackParamList, "Registration">;

export const RegistrationPage: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSecureEnabled, setIsSecureEnabled] = useState(true);
  const [uri, setUri] = useState("");
  const passwordRef = useRef<TextInput>(null);

  const { width, height } = useWindowDimensions();

  const { loading, errorSource } = useAppSelector(state => state.login);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return BackHandler.addEventListener("hardwareBackPress", () => {
      if (animatedValue.value == 1) {
        animatedValue.value = withTiming(0);
        return true;
      }
      return false;
    }).remove
  }, []);

  const onInputForPasswordSubmit = (): void => {
    passwordRef.current?.focus();
  };

  const passwordIconPress = () => {
    setIsSecureEnabled(!isSecureEnabled);
  };

  const prevPage = () => {
    animatedValue.value = withTiming(0);
  };

  const nextPage = () => {
    if (email && password) {
      Keyboard.dismiss();
      animatedValue.value = withTiming(1);
    }
    else
      Toast.show(localization.errors.fildsMustBeFilled);
  };

  const register = () => {
    if (email && password && name) {
      Keyboard.dismiss();
      dispatch(registerAsync({ email, password }))
        .then(result => {
          if (result.meta.requestStatus == "fulfilled")
            props.navigation.dispatch(goToMainPage);
          else {
            Toast.show((result.payload as IAuthParams).error);
            animatedValue.value = withTiming(0);
          }
        });
    }
    else
      Toast.show(localization.errors.fildsMustBeFilled);
  };

  const goBack = () => {
    dispatch(resetError());
    props.navigation.goBack();
  };

  const imageClick = () => {
    launchImageLibrary({ mediaType: "photo" }, result => {
      if (result.assets && result.assets[0].uri)
        setUri(result.assets[0].uri);
    })
  };

  const animatedValue = useSharedValue(0);

  const mainContainerStyle = useAnimatedStyle(() => ({
    height,
    width: width * 2,
    left: interpolate(animatedValue.value, [0, 1], [0, -width]),
  }));

  const pageStyle: ViewStyle = {
    flex: 1,
    width
  }

  const scrollStyle: ViewStyle = {
    height,
    width
  };

  return (
    <ScrollView contentContainerStyle={scrollStyle}>
      <LoadingModal isLoading={loading} />
      
      <ImageBackground source={SplashResources.splash} style={styles.background} resizeMode={"cover"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.ScrollView style={mainContainerStyle} horizontal>
            <View style={pageStyle}>
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
                    onSubmitEditing={nextPage}
                    blurOnSubmit={false}
                    secureTextEntry={isSecureEnabled}
                    icon={isSecureEnabled ? IconsResources.icon_eye : IconsResources.icon_eye_non}
                    onIconPress={passwordIconPress}
                    isError={errorSource == "password" || errorSource == "both"}
                  />
                  <MainButton
                    type={ButtonType.Action}
                    title={localization.login.continue}
                    style={styles.button}
                    onPress={nextPage}
                  />
                  <MainButton
                    type={ButtonType.Action}
                    title={localization.common.back}
                    style={styles.button}
                    onPress={goBack}
                  />
                </View>
              </View>
            </View>
            <View style={pageStyle}>
              <View style={CommonStyles.flex1}>
                <View style={styles.separatorContainer}>
                  <Logo />
                </View>
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={imageClick} style={styles.profileImageBox}>
                    <Image source={ImageResources.user_border} style={styles.profileImageBorder} />
                    <BorderedImage source={uri != "" ? { uri } : user_picture(true)} borderRadius={100} style={styles.profileImage} />
                  </TouchableOpacity>
                  <AuthTextInput
                    label={localization.login.name}
                    containerStyle={styles.input}
                    keyboardType={"default"}
                    value={name}
                    onChangeText={setName}
                    enablesReturnKeyAutomatically={true}
                    returnKeyType={"done"}
                    onSubmitEditing={register}
                    blurOnSubmit={true}
                    autoCapitalize={"words"}
                    isError={errorSource == "email" || errorSource == "both"}
                  />
                </View>
                <View style={styles.registrationContainer}>
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
                    onPress={prevPage}
                  />
                </View>
              </View>
            </View>
          </Animated.ScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </ScrollView>
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
  imageContainer: {
    flex: 2,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  registrationContainer: {
    flex: 3,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
});