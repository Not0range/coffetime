import React from "react";
import { ViewProps, ImageSourcePropType, View, TouchableOpacity, Text, Image, ImageStyle, TextStyle, ViewStyle } from "react-native";
import { IconsResources, ImageResources } from "../../../common/ImageResources.g";
import { styleSheetCreate, styleSheetFlatten } from "../../../common/utils";
import { CommonStyles, Fonts } from "../../../core/theme";

interface IProps extends ViewProps {
  title: string;
  type: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  liked: boolean;
  price: number;
  size: number;
}

export const DrinkCard: React.FC<IProps> = (props: IProps) => {
  const imageStyle = styleSheetFlatten(styles.image, {width: props.size});
  return (
    <View style={styleSheetFlatten(styles.container, props.style, CommonStyles.shadow)}>
      <TouchableOpacity style={styles.card} onPress={props.onPress}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.drinkType}>{props.type}</Text>
        <Image source={props.image} resizeMode={"center"} style={imageStyle} defaultSource={ImageResources.image_no_coffe} />
        <View style={styles.row}>
          <Text style={styles.price}>{props.price}</Text>
          <View style={styles.ruble}>
            <Image source={IconsResources.icon_ruble} />
          </View>
          <Image
            source={props.liked ? IconsResources.icon_heart_active : IconsResources.icon_heart_gray}
            style={styles.likeIcon}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    padding: 4,
    margin: 4,
    flex: 1
  } as ViewStyle,
  image: {
    aspectRatio: 4 / 5,
    flex: 1,
    alignSelf: "center"
  } as ImageStyle,
  title: {
    color: "#717171",
    fontSize: 16,
    fontFamily: Fonts.bold
  } as TextStyle,
  drinkType: {
    fontSize: 12,
    marginBottom: 16,
    color: "#717171"
  } as TextStyle,
  card: {
    flex: 1,
    padding: 8
  } as ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center"
  } as ViewStyle,
  price: {
    fontSize: 24,
    color: "#C8D9AF",
    fontFamily: Fonts.lobster
  } as TextStyle,
  ruble: {
    flex: 1
  } as ImageStyle,
  likeIcon: {
    width: 24,
    height: 24
  } as ImageStyle
});