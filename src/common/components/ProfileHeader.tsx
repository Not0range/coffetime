import React from "react";
import { Image, ImageStyle, ImageURISource, Text, View, ViewStyle } from "react-native";
import { useAppSelector } from "../../core/store/hooks";
import { Colors } from "../../core/theme";
import { user_picture } from "../../core/theme/themeDependencies";
import { LoginType } from "../../modules/login/loginSlice";
import { ImageResources } from "../ImageResources.g";
import { localization } from "../localization/localization";
import { styleSheetCreate } from "../utils";
import { BorderedImage } from "./BorderedImage";

export const ProfileHeader: React.FC = () => {
  const loginType = useAppSelector(state => state.login.type);
  const profile = useAppSelector(state => state.entities.user);
  const {name, photo_url} = profile || {name: localization.login.guest, photo_url: ""};
  const picture: ImageURISource = photo_url ? { uri: photo_url } : user_picture();
  const viaText = loginType == LoginType.facebook ? `${localization.login.via} Facebook` :
    loginType == LoginType.vk ? `${localization.login.via} VK` : "";
    
  return (
    <View style={styles.container}>
      <BorderedImage source={picture} style={styles.image} borderRadius={100} />
      <Text>{localization.login.loginAs} {name}</Text>
      <Text>{viaText}</Text>
    </View>
  );
}

const styles = styleSheetCreate({
  container: {
    padding: 8,
    backgroundColor: Colors.normal,
    borderRadius: 20,
    marginBottom: 8
  } as ViewStyle,
  image: {
    width: 64,
    height: 64
  } as ImageStyle
})