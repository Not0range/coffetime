import { StackScreenProps } from "@react-navigation/stack";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageStyle, Text, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { MainButton } from "../../common/components/MainButton";
import { ButtonType } from "../../common/enums/buttonType";
import { IconsResources } from "../../common/ImageResources.g";
import { localization } from "../../common/localization/localization";
import { styleSheetCreate } from "../../common/utils";
import { Product } from "../../core/api/generated/dto/Product.g";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Colors, CommonStyles } from "../../core/theme";
import { trash_icon } from "../../core/theme/themeDependencies";
import { MainStackParamList } from "../../navigation/MainNavigation";
import { OrderDrink } from "../../types/orderDrink";
import { setCurrentDrink } from "../currentDrink/currentDrinkSlice";
import { OrderItem } from "./components/orderItem";
import { clearOrder, decrementOrder, incrementOrder, removeFromOrder } from "./orderSlice";
import Toast from "react-native-simple-toast";

type Props = StackScreenProps<MainStackParamList, "OrderDrinks">;

export const OrderPage: React.FC<Props> = (props) => {
  const orderDrinks = useAppSelector(state => state.order.orderDrinks);
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState("");

  const clear = () => {
    dispatch(clearOrder());
  };

  const headerRight = () => (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={clear} style={styles.button}>
        <Image source={trash_icon()} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
  useEffect(() => {
    props.navigation.setOptions({ headerRight });
  }, [])

  const increment = (id: string) => {
    dispatch(incrementOrder(id));
  };

  const decrement = (id: string) => {
    dispatch(decrementOrder(id));
  };

  const menu = (id: string) => {
    setSelected(id);
  };

  const dismissMenu = () => {
    setSelected("");
  };

  const openDrink = (item: Product) => {
    dispatch(setCurrentDrink(item));
    props.navigation.navigate("CurrentDrink");
    setSelected("");
  };

  const removeDrink = (id: string) => {
    dispatch(removeFromOrder(id));
    setSelected("");
  };

  const orderPress = () => {
    Toast.show(localization.errors.notImplemented);
  }

  const renterOrder = ({ item }: { item: OrderDrink }) => {
    return (
      <OrderItem
        drink={item.drink}
        count={item.count}
        onIncrement={() => increment(item.drink.id)}
        onDecrement={() => decrement(item.drink.id)}
        menuOpened={selected == item.drink.id}
        onMenuPress={() => menu(item.drink.id)}
        onOpenPress={() => openDrink(item.product)}
        onRemvoePress={() => removeDrink(item.drink.id)}
      />
    )
  };

  const total = _.sumBy(orderDrinks, t => t.count * t.drink.price);

  return (
    <View style={CommonStyles.flexWhiteBackground}>
      <TouchableWithoutFeedback onPress={dismissMenu}>
        <View style={CommonStyles.flex1}>
          <FlatList
            data={orderDrinks}
            keyExtractor={keyExtractor}
            renderItem={renterOrder}
            style={CommonStyles.flex1}
          />
          <View style={styles.bottomContainer}>
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{total}</Text>
              <Image style={styles.rubIcon} source={IconsResources.symbol_rub} />
            </View>
            <MainButton
              type={ButtonType.Action}
              style={styles.orderButton}
              title={localization.cafe.order}
              titleStyle={styles.buttonText}
              disabled={total == 0}
              onPress={orderPress}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
};

const keyExtractor = (item: OrderDrink) => item.drink.id;

const styles = styleSheetCreate({
  icon: {
    height: 24,
    width: 24
  } as ImageStyle,
  buttonsContainer: {
    marginHorizontal: 10,
    flexDirection: "row"
  } as ViewStyle,
  button: {
    margin: 8
  } as ViewStyle,
  bottomContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderTopColor: Colors.grayEA,
    borderTopWidth: 1
  } as ViewStyle,
  priceBox: {
    flex: 2,
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
  orderButton: {
    backgroundColor: Colors.normal,
    flex: 4,
    marginVertical: 10,
    paddingVertical: 8
  } as ViewStyle,
  buttonText: {
    color: Colors.white,
    fontSize: 20
  } as TextStyle,
})