import { Profile } from "../../types/Profile";
import { appSettingsProvider } from "../settings";

export const facebookLoginUrl = `https://www.facebook.com/v14.0/dialog/oauth?client_id=${appSettingsProvider.settings.fbClientId}&response_type=token&redirect_uri=https://www.facebook.com/connect/login_success.html`

const facebookBaseUrl = "https://graph.facebook.com/v14.0";

export async function GetFacebookProfile(token: string): Promise<Profile> {
  const info = await (await fetch(`${facebookBaseUrl}/me?access_token=${token}`)).json();
  const picture = await (await fetch(`${facebookBaseUrl}/me/picture?access_token=${token}&redirect=false&height=200&width=200`)).json();
  return { name: info.name, photo_url: picture.data.url };
}