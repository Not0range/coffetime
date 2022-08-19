import React from "react";
import { Image, ImageProps, View, ViewStyle } from "react-native";
import { isAndroidLollipop, isIos } from "../../core/theme/common";
import { styleSheetFlatten } from "../utils";

interface IProps extends ImageProps {
  borderRadius: number;
}

export const BorderedImage: React.FC<IProps> = (props: IProps) => {
  if (isIos || !isAndroidLollipop) {
    return <Image {...props} resizeMode={"cover"} />;
  } else {
    const style = styleSheetFlatten(props.style) as ViewStyle;
    const containerStyle = styleSheetFlatten(
      style,
      {
        borderRadius: props.borderRadius,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      },
    ) as ViewStyle;

    return (
      <View style={containerStyle}>
        <Image
          source={props.source}
          style={{ width: style.width, height: style.height }}
        />
      </View>
    );
  }
}