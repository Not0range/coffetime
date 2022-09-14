import _ from "lodash";
import React, { useEffect, useState } from "react"
import { Image, ImageStyle, ImageURISource, Platform, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconsResources } from "../../../common/ImageResources.g";
import { localization } from "../../../common/localization/localization";
import { styleSheetCreate, styleSheetFlatten } from "../../../common/utils";
import { Attribute, ProductFull } from "../../../core/api/generated/dto/ProductFull.g";
import { Colors, CommonStyles, Fonts } from "../../../core/theme";
import { menu_icon } from "../../../core/theme/themeDependencies";
import { attributeDictionary } from "../../../types/attributes";

interface IProps {
  onIncrement?: () => void;
  onDecrement?: () => void;
  drink: ProductFull;
  count: number;
  menuOpened?: boolean;
  onMenuPress?: () => void;
  onOpenPress?: () => void;
  onRemvoePress?: () => void;
}

export const OrderItem: React.FC<IProps> = (props) => {
  const { productName, price, imagesPath } = props.drink;
  const { count, menuOpened, onMenuPress } = props;
  const { onIncrement, onDecrement, onOpenPress, onRemvoePress } = props;

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const animatedValue = useSharedValue(menuOpened ? 1 : 0);
  useEffect(() => {
    animatedValue.value = withTiming(menuOpened ? 1 : 0, { duration: 100 });
  }, [menuOpened]);

  const overlayStyle = useAnimatedStyle(() => ({
    position: "absolute",
    height: height == 0 ? undefined : interpolate(animatedValue.value, [0, 1], [0, height]),
    width: width == 0 ? undefined : interpolate(animatedValue.value, [0, 1], [0, width]),
    zIndex: 1,
    right: height == 0 || animatedValue.value == 0 ? -150 : 25,
    top: 25,
    borderRadius: 5,
    borderWidth: height != 0 && animatedValue.value == 0 ? 0 : 1,
    borderColor: Colors.black,
    backgroundColor: Colors.white
  }));

  const layoutHandler = ({ nativeEvent }: any) => {
    if (height == 0) {
      setHeight(nativeEvent.layout.height);
      setWidth(nativeEvent.layout.width);
    }
  }

  const attributeOrder = Object.keys(attributeDictionary);
  const sortAttributes = _.sortBy(props.drink.attribute, ({ iconType: a }) => attributeOrder.indexOf(a));
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
        <Image style={styles.attributeIcon} source={icon} />
      </View>
    )
  };

  return (
    <View style={styleSheetFlatten(styles.container, CommonStyles.shadow)}>
      <Animated.View style={overlayStyle} onLayout={layoutHandler}>
        <TouchableOpacity style={styles.menuItem} onPress={onOpenPress}>
          <Text style={styles.menuText}>{localization.common.open}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onRemvoePress}>
          <Text style={styles.menuText}>{localization.common.remove}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Image source={{ uri: imagesPath }} style={styles.image} />
      <View style={styles.description}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{productName}</Text>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Image style={styles.menuIcon} source={menu_icon()} />
          </TouchableOpacity>
        </View>
        <View style={styles.attributesRow}>
          {sortAttributes.map(attribute)}
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.priceBox}>
            <Text style={styles.priceText}>{price}</Text>
            <Image style={styles.rubIcon} source={IconsResources.symbol_rub} />
          </View>
          <View style={styles.countBox}>
            <TouchableOpacity style={styles.decrementButton} onPress={onDecrement}>
              <Text style={styles.decrementText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{count}</Text>
            <TouchableOpacity style={styles.incrementButton} onPress={onIncrement}>
              <Text style={styles.incrementText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
};

const styles = styleSheetCreate({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    marginHorizontal: 4,
    marginVertical: 4
  } as ViewStyle,
  menuText: {
    fontSize: 16
  } as TextStyle,
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8
  } as ViewStyle,
  image: {
    aspectRatio: 1,
    flex: 1
  } as ImageStyle,
  description: {
    flex: 2,
    padding: 8
  } as ViewStyle,
  topRow: {
    flexDirection: "row"
  } as ViewStyle,
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 20,
    flex: 1
  } as TextStyle,
  menuButton: {
    alignSelf: "center"
  } as ViewStyle,
  menuIcon: {
    width: 24,
    height: 24
  } as ImageStyle,
  attributesRow: {
    flex: 1,
    flexDirection: "row",
    marginTop: 12,
    paddingHorizontal: 4
  } as ViewStyle,
  attributeIcon: {
    marginBottom: 5
  } as ImageStyle,
  icons: {
    marginRight: 16,
    alignItems: "center"
  } as ImageStyle,
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: 16
  } as ViewStyle,
  priceBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  } as ViewStyle,
  priceText: {
    fontSize: 28,
    marginHorizontal: 10
  } as TextStyle,
  rubIcon: {
    alignSelf: "center"
  } as ImageStyle,
  countBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  } as ViewStyle,
  decrementButton: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    aspectRatio: 1
  } as ViewStyle,
  incrementButton: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    aspectRatio: 1
  } as ViewStyle,
  decrementText: {
    fontSize: 22,
    includeFontPadding: false
  } as TextStyle,
  incrementText: {
    fontSize: 22,
    includeFontPadding: false,
    color: Colors.white
  } as TextStyle,
  countText: {
    fontFamily: Fonts.lobster,
    fontSize: 22,
    marginHorizontal: 20,
    textAlignVertical: "center"
  } as TextStyle
});