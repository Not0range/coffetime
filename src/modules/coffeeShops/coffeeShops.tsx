import React from "react";
import { FlatList, View } from "react-native";
import { defaultIdExtractor } from "../../common/helpers";
import { CommonStyles } from "../../core/theme";
import { CoffeeShopTestData, ICoffeeShop } from "../../types/CoffeeShop";
import { CoffeeShopItem } from "./coffeeShopItem";

export const CoffeeShopsList: React.FC = () => {
  return (
    <View style={CommonStyles.flex1}>
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