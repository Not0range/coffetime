import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, ImageStyle } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconsResources } from "../../../common/ImageResources.g";
import { styleSheetCreate } from "../../../common/utils";

interface IProps {
  liked: boolean;
  onPress: () => void;
}

export const LikeButton: React.FC<IProps> = (props) => {
  const [firstRender, setFirstRender] = useState(true);

  const { liked, onPress } = props;

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
    top: interpolate(animatedValue.value, [0, 1, 2], [-16, -24, -16]),
    bottom: interpolate(animatedValue.value, [0, 1, 2], [-16, -24, -16]),
    left: interpolate(animatedValue.value, [0, 1, 2], [0, -8, 0])
  }));

  return (
    <TouchableOpacity onPress={onPress}>
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