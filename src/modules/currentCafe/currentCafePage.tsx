import { StackScreenProps } from "@react-navigation/stack";
import _ from "lodash";
import React, { useEffect } from "react";
import { ImageBackground, ImageStyle, Text, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import { GridWrapper } from "../../common/components/GridWrapper";
import { LoadingView } from "../../common/components/LoadingView";
import { ImageResources } from "../../common/ImageResources.g";
import { LoadState } from "../../common/loadState";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate, styleSheetFlatten } from "../../common/utils";
import { Product } from "../../core/api/generated/dto/Product.g";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles, Fonts } from "../../core/theme";
import { MainStackParamList } from "../../navigation/MainNavigation";
import { setCurrentDrink } from "../currentDrink/currentDrinkSlice";
import { DrinkCard } from "../favoritesDrinks/components/DrinkCard";
import { getProductsCafeAsync } from "./currentCafeSlice";

type Props = StackScreenProps<MainStackParamList, "CurrentCafe">;

export const CurrentCafePage: React.FC<Props> = (props) => {
  const { currentCafe, drinks, loading } = useAppSelector(state => state.currentCafe);
  const sessionId = useAppSelector(state => state.system.authToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (sessionId && currentCafe)
      dispatch(getProductsCafeAsync({sessionId, cafeId: currentCafe.id}));
  }

  const { width } = useWindowDimensions();
  const imageStyle = styleSheetFlatten(styles.cafeImage, { width, aspectRatio: 1 })

  const cafeHeader: React.FC = () => {
    return (
      <ImageBackground source={{ uri: currentCafe?.images }} style={imageStyle} defaultSource={ImageResources.image_no_coffe}>
        <View style={CommonStyles.flex1} />
        <View>
          <Text style={styles.title}>{currentCafe?.name}</Text>
          <Text style={styles.address}>{currentCafe?.address}</Text>
        </View>
      </ImageBackground>
    )
  };

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
          /> :
          <View key={`e${empty++}`} style={styles.empty} />)}
      </View>
    )
  };

  const openDrink = (item: Product) => {
    dispatch(setCurrentDrink(item));
    props.navigation.navigate("CurrentDrink");
  }

  const loadState = loading ? LoadState.firstLoad : 
    !loading && drinks.length > 0 ? LoadState.idle : LoadState.error;

  return (
    <View style={CommonStyles.flex1}>
      <GridWrapper
        ListHeaderComponent={cafeHeader}
        data={drinks}
        keyExtractor={keyExtractor}
        renderItem={renderDrinks}
        itemInRow={2}
        loadState={loadState}
        tryAgain={loadData}
        EmptyComponent={() => null}
        style={styles.container}
      />
    </View>
  )
};

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
  cafeImage: {
    alignContent: "flex-end",
    marginBottom: 8,
    paddingBottom: 8
  } as ViewStyle,
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 28,
    marginHorizontal: 16,
    color: Colors.white
  } as TextStyle,
  address: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    marginHorizontal: 16,
    color: Colors.white
  } as TextStyle
});