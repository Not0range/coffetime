import { Profile } from "../../types/Profile";
import { appSettingsProvider } from "../settings";

export const vkLoginUrl = `https://oauth.vk.com/authorize?client_id=${appSettingsProvider.settings.vkClientId}&` +
`redirect_uri=https://oauth.vk.com/blank.html&response_type=token`;

const vkBaseUrl = "https://api.vk.com/method";

const version = "5.131";

export async function GetVkProfile(token: string): Promise<Profile> {
  const info_response = await fetch(`${vkBaseUrl}/users.get?access_token=${token}&v=${version}`);
  const info = (await info_response.json() as IResponse<IUser>).response[0];

  const photos_response = await fetch(`${vkBaseUrl}/photos.get?owner_id=${info.id}&album_id=profile&count=1&rev=1&access_token=${token}&v=${version}`);
  const photos = (await photos_response.json() as IResponseItems<{sizes: IPicture[]}>).response.items[0].sizes;
  return { name: `${info.last_name} ${info.first_name}`, photo_url: photos[photos.length - 1].url };
}

interface IResponse<T> {
  response: T[]
}

interface IResponseItems<T> {
  response: {
    items: T[]
  }
}

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
}

interface IPicture {
  url: string;
  width: number;
  height: number;
  type: string;
}