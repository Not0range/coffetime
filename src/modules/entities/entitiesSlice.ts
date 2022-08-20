import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { localization } from '../../common/localization/localization';
import { newState } from '../../common/newState';
import { GetFacebookProfile } from '../../core/api/facebookAPI';
import { GetVkProfile } from '../../core/api/vkAPI';
import { IAppState } from '../../core/store/AppState';
import { CoreActions } from '../../core/store/coreActions';
import { AvailableLanguages } from "../../types/interfaces";
import { Profile } from '../../types/Profile';
import { LoginType, logout } from '../login/loginSlice';

export interface IEntitiesState {
  language: AvailableLanguages | null;
  user: Profile | null;
  status: 'idle' | 'loading' | 'failed';
}

export const EntitiesInitialState: IEntitiesState = {
  language: null,
  user: null,
  status: 'idle'
};

export const systemSlice = createSlice({
  name: 'Entities',
  initialState: EntitiesInitialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<AvailableLanguages>) => {
      state.language = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getProfileAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfileAsync.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.user = action.payload;
        state.status = 'idle';
      })
      .addCase(getProfileAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logout, (state) => {
        state.user = null;
      })
  },
});

function rehydrateHandler(state: IEntitiesState, action: PayloadAction<IAppState>): IEntitiesState {
  const nState = action.payload.entities || state;

  return newState(nState, {
    language: nState.language || localization.getLanguage() as AvailableLanguages,
  });
}

export const getProfileAsync = createAsyncThunk<Profile, { token: string, type: LoginType }>(
  'Entities/fetchProfile',
  async ({ token, type }) => {
    if (type == LoginType.facebook)
      return await GetFacebookProfile(token);
    else if (type == LoginType.vk)
      return await GetVkProfile(token);
    return { name: "", photo_url: "" }
  }
);

export const { setLanguage } = systemSlice.actions;
export default systemSlice.reducer;