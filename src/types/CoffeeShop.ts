import { ImageSourcePropType } from "react-native";
import { CoffeeShopImages } from "../common/ImageResources.g";

export interface ICoffeeShop {
  id: number;
  title: string;
  address: string;
  image: ImageSourcePropType;
}

export const CoffeeShopTestData: ICoffeeShop[] = [
  {
    id: 0,
    title: "Coffe",
    address: "ул. Юности д. 120",
    image: CoffeeShopImages.shop1
  },
  {
    id: 1,
    title: "Coffe Lattelady",
    address: "ул.Мадинова пер.6 д.28",
    image: CoffeeShopImages.shop2
  },
  {
    id: 3,
    title: "Coffe Lattelady",
    address: "ул. Маршала д.5/2",
    image: CoffeeShopImages.shop3
  },
  {
    id: 4,
    title: "Coffe",
    address: "ул.25 Октября д.18/5",
    image: CoffeeShopImages.shop4
  }
]