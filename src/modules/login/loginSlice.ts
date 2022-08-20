import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newState } from "../../common/newState";
import { CoreActions } from "../../core/store";
import { IAppState } from "../../core/store/AppState";

export enum LoginType {
  none = "none",
  guest = "guest",
  vk = "vk",
  facebook = "facebook"
}

export interface ILoginState {
  type: LoginType;
  token: string;
  expired: number;
}

export const LoginInitialState: ILoginState = {
  type: LoginType.none,
  token: "",
  expired: 0
}

export const loginSlice = createSlice({
  name: "login",
  initialState: LoginInitialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginState>) => {
      ({ type: state.type, token: state.token, expired: state.expired } = action.payload);
    },
    logout: (state) => {
      ({ type: state.type, token: state.token, expired: state.expired } = {
        type: LoginType.none,
        token: "",
        expired: 0
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(CoreActions.rehydrate, rehydrateHandler)
  },
});

function rehydrateHandler(state: ILoginState, action: PayloadAction<IAppState>): ILoginState {
  return newState(action.payload.login || state, {});
}

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;