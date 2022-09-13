import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { AuthHelper } from "../../common/helpers/authHelper";
import { localization } from "../../common/localization/localization";
import { SignInRequestDto } from "../../core/api/generated/dto/SignInRequest.g";
import { requestsRepository } from "../../core/api/requestsRepository";
import { ExceptionType, NoAuthError } from "../../core/exceptionTypes";
import { CoreActions } from "../../core/store";

export interface IAuthParams extends SignInRequestDto {
  error: string;
  errorSource: ErrorSource;
}

export type ErrorSource = "email" | "password" | "both";

export interface ILoginState {
  loading: boolean;
  error: string | null;
  errorSource: ErrorSource | null;
}

export const LoginInitialState: ILoginState = {
  loading: false,
  error: null,
  errorSource: null
}

const loginSlice = createSlice({
  name: "login",
  initialState: LoginInitialState,
  reducers: {
    resetError: (state) => {
      state.error = "";
      state.errorSource = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        const { error, errorSource } = action.payload as IAuthParams;
        state.error = error;
        state.errorSource = errorSource;
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        const { error, errorSource } = action.payload as IAuthParams;
        state.error = error;
        state.errorSource = errorSource;
      });
  },
});

function rehydrateHandler(): ILoginState {
  return { ...LoginInitialState };
}

export const loginAsync = createAsyncThunk<string, SignInRequestDto>(
  "Login/Authorization",
  async (signInRequest: SignInRequestDto, { rejectWithValue, signal }) => {
    try {
      AuthHelper.checkAuthParams(signInRequest);
      const uuid = await requestsRepository.authorizationApiRequest.signIn(signInRequest, signal);
      return uuid;
    }
    catch (error: any) {
      if (error.name == ExceptionType.Connection)
        return rejectWithValue({ error: localization.errors.loginError, errorSource: "both" });

      if (error.innerError instanceof NoAuthError)
        return rejectWithValue({ error: localization.errors.loginError, errorSource: "both" });

      const errors: string[] = error.message.filter((i: string | null) => i != null);
      const emailError = errors.some((i: string) => i == localization.errors.invalidEmail);
      const passwordError = errors.some((i: string) => i == localization.errors.invalidPassword);
      const errorSource = emailError && passwordError
        ? "both"
        : emailError
          ? "email"
          : "password";
      const errorParams: IAuthParams = { ...signInRequest, errorSource, error: errors.join("\n") };
      return rejectWithValue(errorParams);
    }
  }
);

export const registerAsync = createAsyncThunk<string, SignInRequestDto>(
  "Login/Registration",
  async (signInRequest: SignInRequestDto, { rejectWithValue, signal }) => {
    try {
      AuthHelper.checkAuthParams(signInRequest);
      const uuid = await requestsRepository.authorizationApiRequest.register(signInRequest, signal);
      return uuid;
    }
    catch (error: any) {
      if (error.name == ExceptionType.Connection)
        return rejectWithValue({ error: localization.errors.loginError, errorSource: "both" });

      const errors: string[] = error.message.filter((i: string | null) => i != null);

      const emailError = errors.some((i: string) => i == localization.errors.invalidEmail);
      const passwordError = errors.some((i: string) => i == localization.errors.invalidPassword);
      const errorSource = emailError && passwordError
        ? "both"
        : emailError
          ? "email"
          : "password";
      const errorParams: IAuthParams = { ...signInRequest, errorSource, error: errors.join("\n") };
      return rejectWithValue(errorParams);
    }
  }
);

export const { resetError } = loginSlice.actions;
export default loginSlice.reducer;