import { BaseRequest } from "../BaseRequest";
import { ProductRequest } from "./dto/ProductRequest.g";

export class FavoriteApiRequest extends BaseRequest {
  constructor() {
    super();
    this.setFavorite = this.setFavorite.bind(this);
    this.unsetFavorite = this.unsetFavorite.bind(this);
  }

  setFavorite(productRequest: ProductRequest): Promise<boolean> {
    return this.fetch("Favorite/Set", {
      method: "POST",
      body: JSON.stringify(productRequest)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }

  unsetFavorite(productRequest: ProductRequest): Promise<boolean> {
    return this.fetch("Favorite/Unset", {
      method: "POST",
      body: JSON.stringify(productRequest)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }
}