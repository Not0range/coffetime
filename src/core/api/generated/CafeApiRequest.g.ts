import { BaseRequest } from "../BaseRequest";
import { Cafe } from "./dto/Cafe.g";
import { CafeRequest } from "./dto/CafeRequest.g";

export class CafeApiRequest extends BaseRequest {
  constructor() {
    super();
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  getAll(sessionId: string): Promise<Cafe[]> {
    return this.fetch("Cafe/GetAll", {
      method: "POST",
      body: JSON.stringify(sessionId)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }

  getById(cafeRequest: CafeRequest): Promise<Cafe> {
    return this.fetch("Cafe/GetCafe", {
      method: "POST",
      body: JSON.stringify(cafeRequest)
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }
}