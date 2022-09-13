import LocalizedStrings from "react-native-localization";
import { dateLocalization } from "./dateLocalization";
import { commonLocalization } from "./commonLocalization";
import { pagesLocalization } from "./pagesLocalization";
import { emptyLocalization } from "./emptyLocalization";
import { errorsLocalization } from "./errorsLocalization";
import { DateHelper } from "../helpers/DateHelper";
import { loginLocalization } from "./loginLocalization";
import { cafeLocalization } from "./cafeLocalization";
import { unitsLocalization } from "./unitsLocalization";

class Localization {
    common = new LocalizedStrings(commonLocalization);
    date = new LocalizedStrings(dateLocalization);
    pages = new LocalizedStrings(pagesLocalization);
    empty = new LocalizedStrings(emptyLocalization);
    errors = new LocalizedStrings(errorsLocalization);
    login = new LocalizedStrings(loginLocalization);
    cafe = new LocalizedStrings(cafeLocalization);
    units = new LocalizedStrings(unitsLocalization);

    getLanguage(): string {
        return this.common.getLanguage();
    }

    getInterfaceLanguage(): string {
        return this.common.getInterfaceLanguage();
    }

    setLanguage(language?: string | null): void {
        let localizationLanguage = language;

        if (localizationLanguage == null) {
            localizationLanguage = this.getLanguage();
        }

        const obj: any = this;

        for (const key of Object.keys(this)) {
            if (obj[key].setLanguage) {
                obj[key].setLanguage(localizationLanguage);
            }
        }

        DateHelper.setMomentLocale(localizationLanguage);
    }
}

export const localization = new Localization();