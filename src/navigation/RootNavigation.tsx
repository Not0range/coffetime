import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import { LoginPage } from "../modules/login/loginPage";
import { RegistrationPage } from "../modules/registration/registrationPage";
import { MainPage } from "./MainNavigation";

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  MainPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"Login"} component={LoginPage} />
      <Stack.Screen name={"Registration"} component={RegistrationPage} />
      <Stack.Screen name={"MainPage"} component={MainPage} />
    </Stack.Navigator>
  )
}