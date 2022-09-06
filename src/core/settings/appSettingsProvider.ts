import { IAppSettings } from "./appSettings";
// tslint:disable:no-var-requires
const getSettings = require("./getSettings").getSettings as () => IAppSettings;

class AppSettingsProvider {
  private _settings: IAppSettings | undefined;

  get settings(): IAppSettings {
    if (this._settings)
      return this._settings;

    this._settings = getSettings();
    this.settings.devOptions.disableReduxLogger = this._settings.devOptions.disableReduxLogger;

    return this._settings
  }
}

export const appSettingsProvider = new AppSettingsProvider();
