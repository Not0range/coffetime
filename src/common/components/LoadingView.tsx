import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors, Fonts } from "../../core/theme";
import { styleSheetCreate, styleSheetFlatten } from "../utils";

interface IProps {
  isLoading: boolean;
  style?: ViewStyle;
  transparent?: boolean;
  text?: string;
}

export const LoadingView: React.FC<IProps> = (props) => {
  const [opacity, setOpacity] = useState(new Animated.Value(props.isLoading ? 1 : 0));
  const [isAnimationInProgress, setAnimationInProgress] = useState(false);

  let style = StyleSheet.flatten([props.style, styles.indicatorContainer, { opacity: opacity as any }]);
  if (props.transparent) {
    style = styleSheetFlatten(style, { backgroundColor: Colors.transparent }) as ViewStyle;
  }

  useEffect(() => {
    const config: Animated.TimingAnimationConfig = {
      duration: 300,
      toValue: props.isLoading ? 1 : 0,
      useNativeDriver: true,
    };
    setAnimationInProgress(true);
    Animated.timing(opacity, config).start(() => setAnimationInProgress(false));
  }, [props.isLoading]);

  if (props.isLoading || isAnimationInProgress) {
    return (
      <Animated.View style={style}>
        <ActivityIndicator animating={props.isLoading} size="large" color={Colors.white} />
        {renderText(props.text)}
      </Animated.View>
    );
  } else {
    return null;
  }
}

const renderText = (textToShow?: string): JSX.Element | null => {
  return textToShow != null ? <Text style={styles.text}>{textToShow.toUpperCase()}</Text> : null;
};

const styles = styleSheetCreate({
  indicatorContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white88,
    zIndex: 99,
  } as ViewStyle,
  text: {
    alignSelf: "center",
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingTop: 10,
  } as TextStyle,
});