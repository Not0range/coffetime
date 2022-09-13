import React, { useEffect, useState } from "react"
import { ViewStyle, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconsResources } from "../../../common/ImageResources.g";
import { styleSheetCreate, styleSheetFlatten } from "../../../common/utils";
import { Colors } from "../../../core/theme";

interface IProps extends TouchableWithoutFeedbackProps {
  enabled?: boolean;
  onValueChange?: () => void;
}

export const LikeSwitch: React.FC<IProps> = (props) => {
  const { enabled, onValueChange, style, ...p } = props;
  const [firstRender, setFirstRender] = useState(true);
  const animatedValue = useSharedValue(enabled ? 1 : 0);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    animatedValue.value = withTiming(enabled ? 1 : 0, {
      duration: 200
    });
  }, [enabled]);

  const thumbStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: interpolate(animatedValue.value, [0, 1], [20, -5]),
  }));

  const onSwitch = () => {
    if (onValueChange)
      onValueChange();
  };

  const styleProp = styleSheetFlatten(style, styles.track);

  return (
    <TouchableWithoutFeedback {...p} onPress={onSwitch}>
      <View style={styleProp}>
        <Animated.Image
          source={enabled ? IconsResources.icon_swich_pin_active : IconsResources.icon_swich_pin}
          style={thumbStyle}
        />
      </View>
    </TouchableWithoutFeedback>
  )
};

const styles = styleSheetCreate({
  track: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 50,
    height: 30
  } as ViewStyle,

})