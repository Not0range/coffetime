import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import { LoginPage } from "../modules/login/loginPage";
import { RegistrationPage } from "../modules/registration/registrationPage";
import { MainPage } from "./MainNavigation";
import { Playground } from "../common/Playground";
import { useAppSelector } from "../core/store/hooks";

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  MainPage: undefined;
  Playground: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigation: React.FC = () => {
  const authToken = useAppSelector(state => state.system.authToken);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={authToken ? "MainPage" : "Login"}>
      <Stack.Screen name={"Login"} component={LoginPage} />
      <Stack.Screen name={"Registration"} component={RegistrationPage} />
      <Stack.Screen name={"MainPage"} component={MainPage} />
      <Stack.Screen name={"Playground"} component={Playground} />
    </Stack.Navigator>
  )
}