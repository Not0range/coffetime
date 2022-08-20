import { isUndefined } from "lodash";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Fonts } from "../../core/theme";
import { localization } from "../localization/localization";
import { styleSheetCreate } from "../utils";

export const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoffeTime</Text>
      <Text style={styles.subTitle}>{localization.common.coffeTerritory}</Text>
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    flex: 1
  } as ViewStyle,
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