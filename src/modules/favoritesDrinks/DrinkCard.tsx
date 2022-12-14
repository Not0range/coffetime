import React from "react";
import { ViewProps, ImageSourcePropType, View, TouchableOpacity, Text, Image, ImageStyle, TextStyle, ViewStyle } from "react-native";
import { IconsResources, ImageResources } from "../../common/ImageResources.g";
import { styleSheetCreate, styleSheetFlatten } from "../../common/utils";
import { CommonStyles, Fonts } from "../../core/theme";

interface IProps extends ViewProps {
  title: string;
  type: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  liked: boolean;
  price: number;
}

export const DrinkCard: React.FC<IProps> = (props: IProps) => {
  return (
    <View style={styleSheetFlatten(styles.container, props.style, CommonStyles.shadow)}>
      <TouchableOpacity style={styles.card} onPress={props.onPress}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.drinkType}>{props.type}</Text>
        <Image source={props.image} resizeMode={"contain"} style={styles.image} />
        <View style={styles.row}>
          <Text style={styles.price}>{props.price}</Text>
          <View style={styles.ruble}>
            <Image source={IconsResources.icon_ruble} />
          </View>
          <Image
            source={props.liked ? IconsResources.icon_heart_active : IconsResources.icon_heart_gray}
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
    width: "100%",
    flexShrink: 1
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
  } as ImageStyle
});