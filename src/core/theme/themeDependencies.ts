import { IconsResources, ImageResources } from "../../common/ImageResources.g"
import { isDarkTheme } from "./common";

export const user_picture = (dark: boolean = isDarkTheme()) => dark ? ImageResources.user_white : ImageResources.user;
export const heart_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_heart_white : IconsResources.icon_heart_black;
export const cart_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_cart : IconsResources.icon_cart_black;
export const trash_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_trash : IconsResources.icon_trash_black;
export const menu_icon = (dark: boolean = isDarkTheme()) => dark ? IconsResources.icon_menu : IconsResources.icon_menu_black;