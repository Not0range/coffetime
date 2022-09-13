import React from "react";
import { ViewStyle, ImageStyle, TextStyle, ImageSourcePropType, Image, Text, TouchableOpacity, View } from "react-native";
import { IconsResources, ImageResources } from "../../../common/ImageResources.g";
import { localization } from "../../../common/localization/localization";
import { styleSheetCreate, styleSheetFlatten } from "../../../common/utils";
import { Colors, Fonts } from "../../../core/theme";
import { CommonStyles } from "../../../core/theme/commonStyles";

interface IProps {
  title: string;
  address: string;
  image: ImageSourcePropType;
  onPress?: () => void;
}

export const CafeItem: React.FC<IProps> = (props) => {
  const address = props.address.slice(0, props.address.indexOf(","));
  return (
    <View style={styleSheetFlatten(styles.container, CommonStyles.shadow)}>
      <Image source={props.image} style={styles.image} defaultSource={ImageResources.image_no_coffe} />
      <View style={styles.description}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.place}>{localization.cafe.located}</Text>
        <Text style={styles.address}>{address}</Text>
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
          <Text style={styles.more}>{localization.cafe.more}</Text>
          <Image source={IconsResources.icon_read_more} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    backgroundColor: Colors.white
  } as ViewStyle,
  description: {
    flex: 5,
    paddingTop: 14,
    paddingLeft: 14,
    paddingBottom: 6,
    paddingRight: 6
  } as ViewStyle,
  image: {
    flex: 3,
    aspectRatio: 1
  } as ImageStyle,
  title: {
    color: "#C8D9AF",
    fontSize: 20,
    marginBottom: 14,
    fontFamily: Fonts.bold
  } as TextStyle,
  place: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: Fonts.light,
    color: Colors.gray71
  } as TextStyle,
  address: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.gray71,
    includeFontPadding: false
  } as TextStyle,
  more: {
    fontSize: 14,
    fontFamily: Fonts.light,
    color: Colors.grayB
  } as TextStyle,
  button: {
    flexDirection: "row",
    alignSelf: "flex-end"
  } as ViewStyle,
});