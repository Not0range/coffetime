import { Product } from "../core/api/generated/dto/Product.g";
import { ProductFull } from "../core/api/generated/dto/ProductFull.g";

export interface OrderDrink {
  product: Product;
  drink: ProductFull;
  count: number;
}