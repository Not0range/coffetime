import { StackScreenProps } from "@react-navigation/stack";
import _ from "lodash";
import React, { useEffect } from "react";
import { Image, Text, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import { GridWrapper } from "../../common/components/GridWrapper";
import { ImageResources } from "../../common/ImageResources.g";
import { LoadState } from "../../common/loadState";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { Product } from "../../core/api/generated/dto/Product.g";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles, Fonts } from "../../core/theme";
import { MainStackParamList } from "../../navigation/MainNavigation";
import { setCurrentDrink } from "../currentDrink/currentDrinkSlice";
import { DrinkCard } from "./components/DrinkCard";
import { getFavoriteDrinksAsync, setFavoriteAsync, unsetFavoriteAsync } from "./favoriteDrinksSlice";

type Props = StackScreenProps<MainStackParamList, "FavoriteDrinks">;

export const FavoriteDrinksPage: React.FC<Props> = (props) => {
  const { favoriteDrinks, loading, error } = useAppSelector(state => state.favoriteDrinks);
  const sessionId = useAppSelector(state => state.system.authToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (sessionId)
      dispatch(getFavoriteDrinksAsync(sessionId));
  };

  const { width } = useWindowDimensions();
  const renderDrinks = ({ item }: { item: Product[] }): JSX.Element => {
    let empty = 0;
    return (
      <View style={styles.row}>
        {item.map(t => t != null ?
          <DrinkCard
            key={`i${t.id}`}
            title={t.name}
            type={localization.cafe.coffeeDrink}
            image={{ uri: t.imagesPath }}
            liked={t.favorite}
            price={t.price}
            style={styles.item}
            size={(width) / 2}
            onPress={() => openDrink(t)}
            onLikePress={() => likeDrink(t)}
          /> :
          <View key={`e${empty++}`} style={styles.empty} />)}
      </View>
    )
  };

  const openDrink = (item: Product) => {
    dispatch(setCurrentDrink(item));
    props.navigation.navigate("CurrentDrink");
  };

  const likeDrink = (item: Product) => {
    if (!sessionId) return;
    
    if (!item.favorite)
      dispatch(setFavoriteAsync({ sessionId, productId: item.id }));
    else
      dispatch(unsetFavoriteAsync({ sessionId, productId: item.id }));
  };

  const loadState = loading ? LoadState.firstLoad : 
    !loading && !error ? LoadState.idle : LoadState.error;

  return (
    <View style={styles.container}>
      <GridWrapper
        data={favoriteDrinks}
        keyExtractor={keyExtractor}
        renderItem={renderDrinks}
        itemInRow={2}
        tryAgain={loadData}
        loadState={loadState}
        EmptyComponent={emptyList}
        style={styles.container}
      />
    </View>
  )
};

const emptyList = (): JSX.Element => {
  return (
    <View style={CommonStyles.flex1}>
      <View style={CommonStyles.flex1} />
      <View style={styles.emptyView}>
        <Image source={ImageResources.image_no_coffe} />
      </View>
      <View style={styles.emptyView}>
        <Text>{localization.cafe.noCoffe}</Text>
        <Text>{localization.cafe.tryLater}</Text>
      </View>
      <View style={CommonStyles.flex1} />
    </View>
  );
}

function keyExtractor(items: Product[]): string {
  return `r${_.filter(items, t2 => t2 != null).map((t: any) => t.id).join(" ")}`
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
    padding: 4,
    margin: 4,
  } as ViewStyle,
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  } as ViewStyle,
  emptyText: {
    fontFamily: Fonts.light,
    fontSize: 16
  } as TextStyle
});