import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { newState } from '../../common/newState';
import { IAppState } from './AppState';
import { CoreActions } from './coreActions';

export interface ISystemState {
  buildNumber: number;
  authToken: string | null;
  refreshToken: string | null;
}

export const SystemInitialState: ISystemState = {
  authToken: null,
  refreshToken: null,
  buildNumber: 1,
};

export const systemSlice = createSlice({
  name: 'System',
  initialState: SystemInitialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(CoreActions.rehydrate, rehydrateHandler)
  },
});

function rehydrateHandler(state: ISystemState, action: PayloadAction<IAppState>): ISystemState {
  return newState(action.payload.system || state, {});
}

export const { setToken } = systemSlice.actions;
export default systemSlice.reducer;