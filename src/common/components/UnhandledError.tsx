import React, { Component } from "react";
import { Text, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle } from "react-native";
import { styleSheetCreate } from "../utils";
import { Colors, CommonStyles, Fonts, minWindowDimension } from "../../core/theme";

interface IProps extends ViewProps {
  onReset: () => void;
  isError: boolean;
}

interface IState {
  isError: boolean;
}

export class UnhandledError extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isError: false
    }
  }
  render(): JSX.Element {
    if (!this.state.isError && !this.props.isError)
      return (
        <View style={CommonStyles.flex1}>
          {this.props.children}
        </View>
      )
    return (
      <View style={styles.container}>
        <View style={CommonStyles.flex1} />
        <Text style={styles.text}>An unexpected error occurred</Text>
        <Text style={styles.text}>We already work on it</Text>
        <View style={styles.separator} />
        <TouchableOpacity onPress={this.props.onReset}>
          <Text style={styles.continueText}>Send a report and continue</Text>
        </TouchableOpacity>
        <View style={CommonStyles.flex1} />
      </View>
    );
  }

  componentDidCatch() {
    this.setState({ isError: true });
  }
}

const styles = styleSheetCreate({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  } as ViewStyle,
  text: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: Fonts.regular,
  } as TextStyle,
  separator: {
    margin: 20,
  } as ViewStyle,
  continueText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.black,
    margin: 10,
  } as TextStyle,
  header: {
    backgroundColor: Colors.black,
    width: minWindowDimension,
  } as ViewStyle,
});