import { AppRegistry } from "react-native";
import { App } from "./App";
import { Playground } from "./common/Playground";
import { appSettingsProvider } from "./core/settings";

export function registerApp(): void {
  const rootComponent = appSettingsProvider.settings.devOptions.showAllComponentsOnStart ? Playground : App;
  AppRegistry.registerComponent(appSettingsProvider.settings.appName, () => rootComponent);
}