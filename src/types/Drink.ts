import { ImageSourcePropType } from "react-native";
import { DrinksImages } from "../common/ImageResources.g";

export interface IDrinks {
  id: number;
  title: string;
  type: string;
  image: ImageSourcePropType;
  liked: boolean;
  price: number;
}

export const DrinksTestData: IDrinks[] = [
  {
      id: 0,
      title: "Coffe",
      type: "Кофейный напиток",
      image: DrinksImages.drink1,
      liked: true,
      price: 20
  },
  {
      id: 1,
      title: "Coffe Lattelady",
      type: "Коктейль",
      image: DrinksImages.drink2,
      liked: false,
      price: 15
  },
  {
      id: 2,
      title: "Coffe Lattelady",
      type: "Кофейный напиток",
      image: DrinksImages.drink3,
      liked: false,
      price: 30
  },
  {
      id: 3,
      title: "Coffe",
      type: "Кофейный напиток",
      image: DrinksImages.drink4,
      liked: true,
      price: 25
  }
]