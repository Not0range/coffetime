import { Profile } from "../../types/Profile";
import { appSettingsProvider } from "../settings";

export const vkLoginUrl = `https://oauth.vk.com/authorize?client_id=${appSettingsProvider.settings.vkClientId}&redirect_uri=https://oauth.vk.com/blank.html&response_type=token`;

const vkBaseUrl = "https://api.vk.com/method";

const version = "5.131";

export async function GetVkProfile(token: string): Promise<Profile> {
  const info = (await (await (await fetch(`${vkBaseUrl}/users.get?access_token=${token}&v=${version}`)).json())).response[0];
  const photos = (await (await fetch(`${vkBaseUrl}/photos.get?owner_id=${info.id}&album_id=profile&count=1&rev=1&access_token=${token}&v=${version}`)).json()).response.items[0].sizes;
  return { name: `${info.last_name} ${info.first_name}`, photo_url: photos[photos.length - 1].url };
}