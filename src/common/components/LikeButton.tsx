import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, ImageStyle, TouchableOpacityProps } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconsResources } from "../ImageResources.g";
import { styleSheetCreate } from "../utils";

interface IProps extends TouchableOpacityProps {
  liked: boolean;
  onPress?: () => void;
  size?: number;
  scale?: number;
}

export const LikeButton: React.FC<IProps> = (props) => {
  const [firstRender, setFirstRender] = useState(true);

  const { liked, onPress, size: sizeProp, scale: scaleProp, ...p } = props;
  const size = sizeProp || 16;
  const scale = scaleProp || 8;

  const animatedValue = useSharedValue(liked ? 0 : 2);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    animatedValue.value = withTiming(liked ? 0 : 2, {
      duration: 500
    })
  }, [liked]);

  const iconStyle = useAnimatedStyle(() => ({
    position: "absolute",
    aspectRatio: 1,
    top: interpolate(animatedValue.value, [0, 1, 2], [-size, -size - scale, -size]),
    bottom: interpolate(animatedValue.value, [0, 1, 2], [-size, -size - scale, -size]),
    left: interpolate(animatedValue.value, [0, 1, 2], [0, -scale, 0])
  }));

  return (
    <TouchableOpacity {...p} onPress={onPress}>
      <Animated.View style={iconStyle}>
        <Image
          source={liked ? IconsResources.icon_heart_active : IconsResources.icon_heart_gray}
          style={styles.icon}
        />
      </Animated.View>
    </TouchableOpacity>
  )
};

const styles = styleSheetCreate({
  icon: {
    flex: 1,
    aspectRatio: 1
  } as ImageStyle,
})