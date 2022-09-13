import { IconsResources, ImageResources } from "../../common/ImageResources.g"
import { isDarkTheme } from "./common";

export const user_picture = (dark: boolean = isDarkTheme()) => dark ? ImageResources.user_white : ImageResources.user;
export const heart_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_heart_white : IconsResources.icon_heart_black;