import React from "react";
import { Image, ImageSourcePropType, ImageStyle, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styleSheetCreate, styleSheetFlatten } from "../utils";

interface IProps extends TouchableOpacityProps {
  icon?: ImageSourcePropType;
  text?: string;
  iconStyle?: ImageStyle;
}

export const ButtonWithIcon: React.FC<IProps> = (props) => {
  const style = !props.icon && !props.text ? [props.style, { paddingVertical: 30 }] : [props.style];

  return (
    <TouchableOpacity
      style={style}
      onPress={props.onPress}
    >
      {props.icon ? <Image source={props.icon} style={styleSheetFlatten(styles.icon, props.iconStyle)} /> : null}
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