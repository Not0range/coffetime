import { BaseRequest } from "../BaseRequest";
import { Product } from "./dto/Product.g";
import { CafeRequest } from "./dto/CafeRequest.g";
import { ProductRequest } from "./dto/ProductRequest.g";
import { ProductFull } from "./dto/ProductFull.g";

export class ProductApiRequest extends BaseRequest {
  constructor() {
    super();
    this.getAll = this.getAll.bind(this);
    this.getProductsCafe = this.getProductsCafe.bind(this);
    this.getProduct = this.getProduct.bind(this);
  }

  getAll(sessionId: string): Promise<Product[]> {
    return this.fetch("Product/GetAll", {
      method: "POST",
      body: JSON.stringify(sessionId)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }

  getProductsCafe(cafeRequest: CafeRequest): Promise<Product[]> {
    return this.fetch("Product/GetProductsCafe", {
      method: "POST",
      body: JSON.stringify(cafeRequest)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }

  getProduct(productRequest: ProductRequest): Promise<ProductFull> {
    return this.fetch("Product/GetProduct", {
      method: "POST",
      body: JSON.stringify(productRequest)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }
}