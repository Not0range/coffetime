import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { Colors, CommonStyles } from "../core/theme";
import { LikeSwitch } from "../modules/currentCafe/components/LikeSwitch";
import { LikeButton } from "../modules/currentDrink/components/LikeButton";
import { Logo } from "./components/Logo";
import { styleSheetCreate } from "./utils";

export const Playground: React.FC = () => {
  const [liked, setLiked] = useState(false);
  return (
    <View style={CommonStyles.flex1}>
      <View style={styles.separatorContainer}>
        <Logo />
        <View style={styles.likeContainer}>
          <LikeSwitch enabled={liked} onValueChange={() => setLiked(!liked)} style={{alignSelf: "flex-end"}} />
          <LikeButton liked={liked} onPress={() => setLiked(!liked)} />
        </View>
      </View>
      <View style={styles.separatorContainer}>
      </View>
    </View>
  )
};

const styles = styleSheetCreate({
  separatorContainer: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignContent: "center"
  } as ViewStyle,
  likeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  } as ViewStyle
});