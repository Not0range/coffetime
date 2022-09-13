import { StackScreenProps } from "@react-navigation/stack";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { GridWrapper } from "../../common/components/GridWrapper";
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
import { setFavoriteAsync, unsetFavoriteAsync } from "../favoritesDrinks/favoriteDrinksSlice";
import { LikeSwitch } from "./components/LikeSwitch";
import { getProductsCafeAsync } from "./currentCafeSlice";

type Props = StackScreenProps<MainStackParamList, "CurrentCafe">;

export const CurrentCafePage: React.FC<Props> = (props) => {
  const [liked, setLiked] = useState(false);

  const { currentCafe, drinks, loading } = useAppSelector(state => state.currentCafe);
  const sessionId = useAppSelector(state => state.system.authToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (sessionId && currentCafe)
      dispatch(getProductsCafeAsync({ sessionId, cafeId: currentCafe.id }));
  }

  const { width } = useWindowDimensions();
  const imageStyle = styleSheetFlatten(styles.cafeImage, { width, aspectRatio: 1 });

  const likedChange = () => {
    setLiked(!liked);
  }

  const cafeHeader: React.FC = () => {
    return (
      <ImageBackground source={{ uri: currentCafe?.images }} defaultSource={ImageResources.image_no_coffe} style={imageStyle}>
        <LinearGradient start={{x: 0, y: 0.52}} end={{x: 0, y: 1}} colors={["#FFFFFF00", "#F7ECDAFF"]} style={styles.gradient}>
          <View style={CommonStyles.flex1} />
          <View style={styles.imageBottom}>
            <View style={CommonStyles.flex1}>
              <Text style={styles.title}>{currentCafe?.name}</Text>
              <Text style={styles.address}>{currentCafe?.address}</Text>
            </View>
            <LikeSwitch enabled={liked} onValueChange={likedChange} style={styles.switch} />
          </View>
        </LinearGradient>
      </ImageBackground >
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
    !loading && drinks.length > 0 ? LoadState.idle : LoadState.error;

  return (
    <View style={CommonStyles.flexWhiteBackground}>
      <GridWrapper
        ListHeaderComponent={<View children={cafeHeader({})} />}
        data={drinks}
        keyExtractor={keyExtractor}
        renderItem={renderDrinks}
        itemInRow={2}
        loadState={loadState}
        tryAgain={loadData}
        EmptyComponent={() => null}
        style={CommonStyles.flex1}
        contentContainerStyle={styles.grid}
      />
    </View>
  )
};

function keyExtractor(items: Product[]): string {
  return `r${_.filter(items, t2 => t2 != null).map((t: any) => t.id).join(" ")}`
}

const styles = styleSheetCreate({
  grid: {
    paddingHorizontal: 4
  } as ViewStyle,
  row: {
    flexDirection: "row",
    aspectRatio: 1.25
  } as ViewStyle,
  item: {
    backgroundColor: Colors.white,
    margin: 4
  } as ViewStyle,
  empty: {
    flex: 1,
    padding: 4,
    margin: 4
  } as ViewStyle,
  cafeImage: {
    marginBottom: 4,
    alignContent: "flex-end"
  } as ViewStyle,
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 28,
    marginHorizontal: 6
  } as TextStyle,
  address: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    marginHorizontal: 6
  } as TextStyle,
  imageBottom: {
    marginLeft: 10,
    marginRight: 20,
    flexDirection: "row"
  } as ViewStyle,
  switch: {
    alignSelf: "flex-end"
  } as ViewStyle,
  gradient: {
    flex: 1,
    paddingBottom: 8
  } as ViewStyle
});