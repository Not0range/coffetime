import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { localization } from "../../common/localization/localization";
import { Cafe } from "../../core/api/generated/dto/Cafe.g";
import { requestsRepository } from "../../core/api/requestsRepository";
import { CoreActions } from "../../core/store";
import Toast from "react-native-simple-toast";

export interface ICafeState {
  loading: boolean;
}

export const CafeInitialState: ICafeState = {
  loading: false
}

const cafeSlice = createSlice({
  name: "Cafe",
  initialState: CafeInitialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getAllCafeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCafeAsync.fulfilled, (state, action: PayloadAction<Cafe[]>) => {
        state.loading = false;
      })
      .addCase(getAllCafeAsync.rejected, (state) => {
        state.loading = false;
      })
  }
})

function rehydrateHandler(): ICafeState {
  return {...CafeInitialState};
}

export const getAllCafeAsync = createAsyncThunk<Cafe[], string>(
  "Cafe/GetAll",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const cafes = await requestsRepository.cafeApiRequest.getAll(sessionId);
      return cafes;
    }
    catch (error: any) {
      Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
      return rejectWithValue([]);
    }
  }
);

export default cafeSlice.reducer;