import React, { useEffect, useRef, useState } from "react"
import { ImageStyle, TouchableOpacity, ViewStyle, Animated, TouchableOpacityProps } from "react-native"
import { IconsResources } from "../../../common/ImageResources.g";
import { styleSheetCreate, styleSheetFlatten } from "../../../common/utils";
import { Colors } from "../../../core/theme";

interface IProps extends TouchableOpacityProps {
  enabled?: boolean;
  onValueChange?: () => void;
}

export const LikeSwitch: React.FC<IProps> = (props) => {
  const { enabled, onValueChange, style, ...p } = props;
  const [firstRender, setFirstRender] = useState(true);
  const animatedValue = useRef(new Animated.Value(enabled ? 1 : 0)).current;

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    Animated.timing(animatedValue, {
      toValue: enabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [enabled]);

  const thumbStyle: ImageStyle = {
    position: "absolute",
    left: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -5]
    }) as any,
  };

  const onSwitch = () => {
    if (onValueChange)
      onValueChange();
  };

  const styleProp = styleSheetFlatten(style, styles.track);

  return (
    <TouchableOpacity {...p} style={styleProp} onPress={onSwitch}>
      <Animated.Image
        source={enabled ? IconsResources.icon_swich_pin_active : IconsResources.icon_swich_pin}
        style={thumbStyle}
      />
    </TouchableOpacity>
  )
};

const styles = styleSheetCreate({
  track: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 50,
    height: 30
  } as ViewStyle
})