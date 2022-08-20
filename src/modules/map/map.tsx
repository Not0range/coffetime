import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import React from "react";
import { Image, View } from "react-native";
import { ImageResources } from "../../common/ImageResources.g";
import { CommonStyles } from "../../core/theme";
import { ShopsStackParamList } from "../../navigation/MapAndShopsNavigation";

type Props = MaterialTopTabScreenProps<ShopsStackParamList, "Map">;

export const Map: React.FC<Props> = (props: Props) => {
  return (
    <View style={CommonStyles.flex1}>
      <Image style={{ flex: 1 }} source={ImageResources.map} />
    </View>
  )
}