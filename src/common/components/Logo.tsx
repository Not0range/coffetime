import React from "react";
import { Text, TextStyle, View } from "react-native";
import { CommonStyles, Fonts } from "../../core/theme";
import { localization } from "../localization/localization";
import { styleSheetCreate } from "../utils";

export const Logo: React.FC = () => {
  return (
    <View style={CommonStyles.flex1}>
      <Text style={styles.title}>CoffeTime</Text>
      <Text style={styles.subTitle}>{localization.common.coffeTerritory}</Text>
    </View>
  )
}

const styles = styleSheetCreate({
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 64,
    textAlign: "center",
    color: "white"
  } as TextStyle,
  subTitle: {
    fontSize: 16,
    textAlign: "left",
    marginLeft: 135,
    marginTop: 65,
    position: "absolute",
    color: "white"
  } as TextStyle
});