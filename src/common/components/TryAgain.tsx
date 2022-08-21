import React from "react";
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Fonts } from "../../core/theme";
import { localization } from "../localization/localization";
import { styleSheetCreate } from "../utils";

interface IProps {
  onPress: () => void;
  errorText?: string | null;
}

export const TryAgain: React.FC<IProps> = (props: IProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.errorText}</Text>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.textTryMore}>{localization.errors.tryAgain}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,
  text: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    textAlign: "center",
    fontSize: 16,
  } as TextStyle,
  textTryMore: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  } as TextStyle,
});