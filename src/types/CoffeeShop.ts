import { ImageSourcePropType } from "react-native";
import { CoffeeShopImages } from "../common/ImageResources.g";

export interface ICoffeeShop {
  id: number;
  title: string;
  address: string;
  image: ImageSourcePropType;
  latitude: number;
  longtitude: number;
}

export const CoffeeShopTestData: ICoffeeShop[] = [
  {
    id: 0,
    title: "Coffe",
    address: "ул. Юности д. 55",
    image: CoffeeShopImages.shop1,
    latitude: 46.832019,
    longtitude: 29.674405
  },
  {
    id: 1,
    title: "Coffe Lattelady",
    address: "ул. Клары Цеткин д.2а",
    image: CoffeeShopImages.shop2,
    latitude: 46.848048,
    longtitude: 29.611084
  },
  {
    id: 3,
    title: "Coffe Lattelady",
    address: "ул. Карла Либкнехта д.226",
    image: CoffeeShopImages.shop3,
    latitude: 46.839723,
    longtitude: 29.613314
  },
  {
    id: 4,
    title: "Coffe",
    address: "ул. 25 Октября д.18/5",
    image: CoffeeShopImages.shop4,
    latitude: 46.835245,
    longtitude: 29.599557
  }
]