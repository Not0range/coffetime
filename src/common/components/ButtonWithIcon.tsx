import React from "react";
import { Image, ImageSourcePropType, ImageStyle, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { IconsResources } from "../ImageResources.g";
import { localization } from "../localization/localization";
import { styleSheetCreate } from "../utils";

interface IProps extends TouchableOpacityProps {
  icon?: ImageSourcePropType;
  text?: string;
}

export const ButtonWithIcon: React.FC<IProps> = (props: IProps) => {
  const style = !props.icon && !props.text ? [props.style, {paddingVertical: 30}] : [props.style];
  return (
    <TouchableOpacity
      style={style}
      onPress={props.onPress}
    >
      {props.icon ? <Image source={props.icon} style={styles.icon} /> : null}
      {props.text ? <Text style={styles.buttonText}>{props.text}</Text> : null}
    </TouchableOpacity>
  )
}

const styles = styleSheetCreate({
  icon: {
    alignSelf: "flex-start",
  } as ImageStyle,
  buttonText: {
    color: "white",
    fontSize: 18,
    flex: 1,
    textAlign: "center"
  } as TextStyle
});