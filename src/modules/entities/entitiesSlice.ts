import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { localization } from '../../common/localization/localization';
import { newState } from '../../common/newState';
import { Cafe } from '../../core/api/generated/dto/Cafe.g';
import { IAppState } from '../../core/store/AppState';
import { CoreActions } from '../../core/store/coreActions';
import { AvailableLanguages } from "../../types/interfaces";
import { getAllCafeAsync } from '../cafes/cafeSlice';

export interface IEntitiesState {
  language: AvailableLanguages | null;
  cafes: Cafe[];
}

export const EntitiesInitialState: IEntitiesState = {
  language: null,
  cafes: []
};

const systemSlice = createSlice({
  name: 'Entities',
  initialState: EntitiesInitialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<AvailableLanguages>) => {
      state.language = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getAllCafeAsync.fulfilled, (state, action: PayloadAction<Cafe[]>) => {
        state.cafes = action.payload;
      })
  },
});

function rehydrateHandler(state: IEntitiesState, action: PayloadAction<IAppState>): IEntitiesState {
  const nState = action.payload.entities || state;

  return newState(nState, {
    language: nState.language || localization.getLanguage() as AvailableLanguages,
  });
}

export const { setLanguage } = systemSlice.actions;
export default systemSlice.reducer;