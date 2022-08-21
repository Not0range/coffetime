import React from "react";
import { FlatList, View, ViewStyle } from "react-native";
import { defaultIdExtractor } from "../../common/helpers";
import { styleSheetCreate } from "../../common/utils";
import { Colors } from "../../core/theme";
import { CoffeeShopTestData, ICoffeeShop } from "../../types/CoffeeShop";
import { CoffeeShopItem } from "./coffeeShopItem";

export const CoffeeShopsList: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={CoffeeShopTestData}
        keyExtractor={defaultIdExtractor}
        renderItem={renderCafe} />
    </View>
  )
}

const renderCafe = ({ item }: { item: ICoffeeShop }): JSX.Element => {
  return (
    <CoffeeShopItem title={item.title} address={item.address} image={item.image} />
  )
}

const styles = styleSheetCreate({
  container: {
    flex: 1,
    backgroundColor: Colors.gray
  } as ViewStyle
});