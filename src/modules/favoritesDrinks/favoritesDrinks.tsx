import _ from "lodash";
import React from "react";
import { View, ViewStyle } from "react-native";
import { GridWrapper } from "../../common/components/GridWrapper";
import { LoadState } from "../../common/loadState";
import { styleSheetCreate } from "../../common/utils";
import { Colors } from "../../core/theme";
import { IDrinks, DrinksTestData } from "../../types/Drink";
import { DrinkCard } from "./DrinkCard";

export const FavoritesDrinks: React.FC = () => {
  const emptyFunc = () => {};
  return (
    <View style={styles.container}>
      <GridWrapper
        data={DrinksTestData}
        keyExtractor={t => `r${_.filter(t, t2 => t2 != null).map((t: any) => t.id).join("")}`}
        renderItem={renderDrinks}
        itemInRow={2} 
        tryAgain={emptyFunc}
        loadState={LoadState.idle}
        EmptyComponent={() => null}
        style={styles.container}
      />
    </View>
  )
}

const renderDrinks = ({ item }: {item: IDrinks[]}): JSX.Element => {
  let empty = 0;
  return (
    <View style={styles.row}>
      {item.map(t => t != null ?
        <DrinkCard key={`i${t.id}`} title={t.title} type={t.type} image={t.image} liked={t.liked} price={t.price} style={styles.item} /> :
        <View key={`e${empty++}`} style={styles.empty} />)}
    </View>
  )
}

const styles = styleSheetCreate({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
    padding: 4
  } as ViewStyle,
  grid: {
    flex: 1,
    backgroundColor: Colors.gray
  } as ViewStyle,
  row: {
    flexDirection: "row",
    aspectRatio: 1.25
  } as ViewStyle,
  item: {
    backgroundColor: Colors.white
  } as ViewStyle,
  empty: {
    flex: 1,
  } as ViewStyle,
});