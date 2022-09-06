import { IconsResources } from "../../common/ImageResources.g"
import { isDarkTheme } from "./common";

export const heart_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_heart_white : IconsResources.icon_heart_black;