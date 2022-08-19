import React from "react";
import { Text, View } from "react-native";
import { CommonStyles } from "../../core/theme";

export const TestPage: React.FC = () => {
    return (
        <View style={CommonStyles.flex1}>
            <Text>text1</Text>
            <Text>text3</Text>
            <Text>text2</Text>
        </View>
    )
}