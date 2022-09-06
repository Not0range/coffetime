import { BaseRequest } from "../BaseRequest";
import { AuthorizationApiRequest } from "./AuthorizationApiRequest.g";
import { CafeApiRequest } from "./CafeApiRequest.g";
import { FavoriteApiRequest } from "./FavoriteApiRequest";
import { ProductApiRequest } from "./ProductApiRequest.g";

export class RequestsRepository extends BaseRequest {
  authorizationApiRequest = new AuthorizationApiRequest();
  cafeApiRequest = new CafeApiRequest();
  productApiRequest = new ProductApiRequest();
  favoriteApiRequest = new FavoriteApiRequest();
}