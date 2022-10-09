import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { DevSettings, UIManager } from "react-native";
import { UnhandledError } from "./common/components/UnhandledError";
import { NavigationContainer } from '@react-navigation/native';
import { LoadingModal } from "./common/components/LoadingModal";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore, MigrateStoreMode } from "./core/store/configureStore";
import { localization } from "./common/localization/localization";
import { appSettingsProvider } from "./core/settings";
import { Splash } from "./common/components/Splash";
import { RootNavigation } from "./navigation/RootNavigation";
import DevMenu from "react-native-dev-menu";

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const { store, persistor } = createStore(appSettingsProvider.settings.devOptions.purgeStateOnStart
  ? MigrateStoreMode.purge
  : MigrateStoreMode.none);

export { store }

export const App: React.FC = () => {
  const [isError, setError] = useState(false);

  const forceAppReset = () => {
    setError(true);
    resetState(MigrateStoreMode.resetStatePreserveToken);
  }

  const resetState = (mode: MigrateStoreMode): void => {
    createStore(mode);
    setError(false);
  }

  useEffect(() => {
    if (__DEV__) {
      DevMenu.addItem(
        "Reset Store and Reload",
        () => {
          resetState(MigrateStoreMode.purge);
          DevSettings.reload();
        },
      );
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Splash />} persistor={persistor}>
        <UnhandledError onReset={forceAppReset} isError={isError}>
          <NavigationContainer>
            <RootNavigation />
            <LoadingModal isLoading={false} />
          </NavigationContainer>
        </UnhandledError>
      </PersistGate>
    </Provider>
  )
}

function createStore(mode: MigrateStoreMode) {
  const { store, persistor } = configureStore(onStoreConfigured, { migrateMode: mode });
  return { store, persistor };
}

function onStoreConfigured() {
  const s = store;
  const state = s.getState();

  if (state != null && state.entities != null) {
    localization.setLanguage(state.entities.language);
  }

  // BaseRequest.globalOptions = {
  //   setToken: (t: TokenResponse): any => store.dispatch(SystemActions.setToken(t)),
  //   getToken: (): string | null => store.getState().system.authToken,
  //   onAuthError: _.debounce(() => {
  //     this.logout();
  //   }, 600),
  // };

  // if (appSettingsProvider.settings.useBugReporter) {
  //   BugsnagConfiguration.configure(store);
  // }
}