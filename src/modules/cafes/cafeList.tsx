import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import React from "react";
import { FlatList, View, ViewStyle } from "react-native";
import { defaultIdExtractor } from "../../common/helpers";
import { styleSheetCreate } from "../../common/utils";
import { Cafe } from "../../core/api/generated/dto/Cafe.g";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors } from "../../core/theme";
import { ShopsStackParamList } from "../../navigation/MapAndListNavigation";
import { setCurrentCafe } from "../currentCafe/currentCafeSlice";
import { CafeItem } from "./components/cafeItem";

type Props = MaterialTopTabScreenProps<ShopsStackParamList, "Map">;

export const CoffeeShopsList: React.FC<Props> = (props) => {
  const cafes = useAppSelector(state => state.entities.cafes);
  const dispatch = useAppDispatch();

  const renderCafe = ({ item }: { item: Cafe }): JSX.Element => {
    return (
      <CafeItem title={item.name} address={item.address} image={{uri: item.images}} onPress={() => goToCafe(item)} />
    )
  };

  const goToCafe = (cafe: Cafe) => {
    dispatch(setCurrentCafe(cafe));
    props.navigation.getParent()?.navigate("CurrentCafe");
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cafes}
        keyExtractor={defaultIdExtractor}
        renderItem={renderCafe} />
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    flex: 1,
    backgroundColor: Colors.gray
  } as ViewStyle
});