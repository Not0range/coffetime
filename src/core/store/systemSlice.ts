import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { newState } from '../../common/newState';
import { loginAsync, registerAsync } from '../../modules/login/loginSlice';
import { IAppState } from './AppState';
import { CoreActions } from './coreActions';

export interface ISystemState {
  buildNumber: number;
  authToken: string | null;
}

export const SystemInitialState: ISystemState = {
  buildNumber: 1,
  authToken: null
};

const systemSlice = createSlice({
  name: 'System',
  initialState: SystemInitialState,
  reducers: {
    logout: (state) => {
      state.authToken = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(CoreActions.rehydrate, rehydrateHandler)
    .addCase(loginAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    })
    .addCase(registerAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    })
  },
});

function rehydrateHandler(state: ISystemState, action: PayloadAction<IAppState>): ISystemState {
  return newState(action.payload.system || state, {});
}

export const { logout } = systemSlice.actions;
export default systemSlice.reducer;