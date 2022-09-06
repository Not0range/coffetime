import { BaseRequest } from "../BaseRequest";
import { SignInRequestDto } from "./dto/SignInRequest.g";

export class AuthorizationApiRequest extends BaseRequest {
  constructor() {
    super();
    this.signIn = this.signIn.bind(this);
    this.register = this.register.bind(this);
  }

  signIn(signInRequest: SignInRequestDto, signal: AbortSignal): Promise<string> {
    return this.fetch("User/Authorization", {
      method: "POST",
      body: JSON.stringify(signInRequest),
      signal
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }

  register(signInRequest: SignInRequestDto, signal: AbortSignal): Promise<string> {
    return this.fetch("User/Register", {
      method: "POST",
      body: JSON.stringify(signInRequest),
      signal
    })
    .then(response => response.json())
    .catch(BaseRequest.handleError);
  }
}