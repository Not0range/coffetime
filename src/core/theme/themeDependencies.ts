import { ImageResources } from "../../common/ImageResources.g"
import { isDarkTheme } from "./common";

export const user_picture = (dark: boolean = isDarkTheme()) => dark ? ImageResources.user_white : ImageResources.user;