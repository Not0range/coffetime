import React, { useEffect, useState } from "react";
import { Animated, Image, ImageStyle, ImageURISource, Insets, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors, Fonts, isIos } from "../../core/theme";
import { styleSheetCreate, styleSheetFlatten } from "../utils";


interface IProps extends TextInputProps {
  label: string;
  icon?: ImageURISource;
  iconStyle?: ImageStyle;
  onIconPress?: () => void;
  isError?: boolean;
  containerStyle?: ViewStyle;
  inputRef?: React.RefObject<TextInput>;
}

export const AuthTextInput: React.FC<IProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const { label, isError, containerStyle, ...p } = props;

  const animatedValue = new Animated.Value(props.value == "" ? 0 : 1);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: (isFocused || props.value != "") ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start()
  }, [isFocused, props.value]);

  const labelStyle: TextStyle = {
    position: "absolute",
    left: isIos ? 5 : 7,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }) as any,
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 14],
    }) as any,
    color: isError ? Colors.paleRed : Colors.black,
  };
  const container = styleSheetFlatten(
    [isError && isFocused
      ? styles.errorContainer
      : styles.container, containerStyle
    ]) as ViewStyle;

  const renderIcon = (): JSX.Element | null => {
    const { icon, iconStyle, onIconPress } = props;

    if (icon != null) {
      return (
        <TouchableOpacity onPress={onIconPress} activeOpacity={0.6} hitSlop={hitSlopInsets}>
          <Image source={icon} style={iconStyle} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);;

  return (
    <View style={container}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        ref={props.inputRef}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        underlineColorAndroid={Colors.transparent}
        autoFocus={false}
        autoCorrect={false}
        autoCapitalize={"none"}
        {...p}
      />
      {renderIcon()}
    </View>
  )
}

const hitSlopInsets: Insets = {
  top: 15,
  left: 15,
  bottom: 15,
  right: 15,
};

const commonContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: isIos ? 20 : 5,
  paddingBottom: isIos ? 6 : undefined,
  borderBottomWidth: 2,
  borderBottomColor: Colors.whiteTwo,
};

const styles = styleSheetCreate({
  container: styleSheetFlatten([commonContainer]) as ViewStyle,
  errorContainer: styleSheetFlatten([commonContainer, { borderBottomColor: Colors.paleRed }]) as ViewStyle,
  input: {
    flex: 1,
    fontSize: 20,
    fontFamily: Fonts.regular,
    color: Colors.black,
  } as TextStyle,
  icon: {
    height: 24,
    width: 15,
    resizeMode: "contain"
  } as ImageStyle,
});