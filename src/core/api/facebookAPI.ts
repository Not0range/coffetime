import { Profile } from "../../types/Profile";
import { appSettingsProvider } from "../settings";

export const facebookLoginUrl = `https://www.facebook.com/v14.0/dialog/oauth?client_id=${appSettingsProvider.settings.fbClientId}&` +
`response_type=token&redirect_uri=https://www.facebook.com/connect/login_success.html`

const facebookBaseUrl = "https://graph.facebook.com/v14.0";

export async function GetFacebookProfile(token: string): Promise<Profile> {
  const info_response = await fetch(`${facebookBaseUrl}/me?access_token=${token}`)
  const info = await info_response.json() as IUser;

  const picture_response = await fetch(`${facebookBaseUrl}/me/picture?access_token=${token}&redirect=false&height=200&width=200`);
  const picture = await picture_response.json() as IPicture;
  return { name: info.name, photo_url: picture.data.url };
}

interface IUser {
  id: number;
  name: string;
}

interface IPicture {
  data: IPictureSource;
}

interface IPictureSource {
  url: string;
  height: number;
  width: number;
}