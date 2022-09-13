import React, { useEffect } from "react";
import { Image, ImageStyle, ImageURISource, ScrollView, Text, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";
import { LoadingView } from "../../common/components/LoadingView";
import { MainButton } from "../../common/components/MainButton";
import { ButtonType } from "../../common/enums/buttonType";
import { IconsResources, ImageResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate, styleSheetFlatten } from "../../common/utils";
import { Attribute } from "../../core/api/generated/dto/ProductFull.g";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles, Fonts } from "../../core/theme";
import { setFavoriteAsync, unsetFavoriteAsync } from "../favoritesDrinks/favoriteDrinksSlice";
import { LikeButton } from "../../common/components/LikeButton";
import { getProductFullAsync } from "./currentDrinkSlice";

const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus bibendum interdum. Curabitur ornare consectetur purus id tincidunt. Morbi at cursus arcu. Aliquam et metus ligula. Proin vel erat lectus. Phasellus ullamcorper augue lectus. Nam tincidunt cursus ex vitae tristique. Donec interdum massa ac orci bibendum, vel consectetur dui facilisis. Curabitur cursus malesuada arcu. Nulla facilisi. Pellentesque finibus nulla eros, eu egestas ex porttitor id. In placerat porta cursus. Vestibulum fringilla id justo quis gravida. Duis libero risus, fringilla in augue eu, gravida consequat eros.";

export const CurrentDrinkPage: React.FC = () => {
  const { currentDrinkFull, currentDrink, loading } = useAppSelector(state => state.currentDrink);
  const sessionId = useAppSelector(state => state.system.authToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionId && currentDrink)
      dispatch(getProductFullAsync({ sessionId, productId: currentDrink.id }));
  }, []);

  const { width } = useWindowDimensions();
  const imageStyle = styleSheetFlatten(styles.image, { width: width - 120 });

  const setFavorite = () => {
    if (!currentDrinkFull || !sessionId) return;

    if (!currentDrinkFull.favarite)
      dispatch(setFavoriteAsync({ sessionId, productId: currentDrinkFull.id }));
    else
      dispatch(unsetFavoriteAsync({ sessionId, productId: currentDrinkFull.id }));
  }

  return (
    <View style={CommonStyles.flex1}>
      <LoadingView style={CommonStyles.flex1} isLoading={loading} />
      {!loading ?
        <View style={CommonStyles.flex1}>
          <View style={styles.topContainer}>
            <ScrollView style={styles.scroll}>
              <Image
                source={{ uri: currentDrinkFull?.imagesPath }}
                defaultSource={ImageResources.image_no_coffe}
                style={imageStyle}
                resizeMode={"cover"}
              />
              <View style={styles.titleRow}>
                <Text style={styles.title}>{currentDrinkFull?.productName}</Text>
                <LikeButton liked={currentDrinkFull != null && currentDrinkFull.favarite} onPress={setFavorite} />
              </View>
              <View style={styles.attributesRow}>
                {currentDrinkFull?.attribute.map(attribute)}
              </View>
              <Text style={styles.description}>{description}</Text>
            </ScrollView>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{currentDrinkFull?.price}</Text>
              <Image source={IconsResources.symbol_rub} />
            </View>
            <MainButton type={ButtonType.Action} style={styles.button} title={localization.cafe.order} titleStyle={styles.buttonText} />
          </View>
        </View> : null}
    </View>
  )
};

const attribute = (item: Attribute) => {
  let icon: ImageURISource = IconsResources.icon_coffe;
  switch (item.iconType) {
    case "milk":
      icon = IconsResources.icon_milk;
      break;
    case "coffe":
      icon = IconsResources.icon_coffe;
      break;
    case "water":
      icon = IconsResources.icon_water;
      break;
    case "temperature":
      icon = IconsResources.icon_temperature;
      break;
    case "pressure":
      icon = IconsResources.icon_pressure;
      break;
  }
  return (
    <View style={styles.icons} key={item.id}>
      <Image source={icon} />
      <Text>{Math.ceil(Math.random() * 100)}</Text>
    </View>
  )
};

const styles = styleSheetCreate({
  topContainer: {
    flex: 8,
  } as ViewStyle,
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 20,
    borderTopColor: Colors.black,
    borderTopWidth: 1
  } as ViewStyle,
  scroll: {
    paddingHorizontal: 20
  } as ViewStyle,
  image: {
    flex: 1,
    aspectRatio: 1,
    alignSelf: "center"
  } as ImageStyle,
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  } as ViewStyle,
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 24,
    marginRight: 8
  } as TextStyle,
  attributesRow: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 16
  } as ViewStyle,
  icons: {
    marginRight: 16,
    alignItems: "center"
  } as ImageStyle,
  description: {
    fontFamily: Fonts.light,
    fontSize: 16
  } as TextStyle,
  priceBox: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  } as ViewStyle,
  priceText: {
    fontSize: 28,
    marginHorizontal: 10
  } as TextStyle,
  button: {
    backgroundColor: Colors.normal,
    flex: 5,
    marginVertical: 10,
    paddingVertical: 0
  } as ViewStyle,
  buttonText: {
    color: Colors.white,
    fontSize: 20
  } as TextStyle,
  likeIcon: {
    width: 30,
    height: 30
  } as ImageStyle
});