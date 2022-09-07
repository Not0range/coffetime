import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, Animated, ImageStyle, ViewStyle, Text, TextStyle, View } from "react-native";
import { IconsResources } from "../../../common/ImageResources.g";
import { styleSheetCreate } from "../../../common/utils";

interface IProps {
  liked: boolean;
  onPress: () => void;
}

export const LikeButton: React.FC<IProps> = (props) => {
  const [firstRender, setFirstRender] = useState(true);

  const { liked, onPress } = props;

  const animatedValue = new Animated.Value(liked ? 0 : 2);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    Animated.timing(animatedValue, {
      toValue: liked ? 2 : 0,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [liked]);

  const iconStyle: ImageStyle = {
    position: "absolute",
    aspectRatio: 1,
    top: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [-16, -24, -16]
    }) as any,
    bottom: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [-16, -24, -16]
    }) as any,
    left: animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -8, 0]
    }) as any,
  };

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