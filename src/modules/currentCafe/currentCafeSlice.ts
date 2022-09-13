import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cafe } from "../../core/api/generated/dto/Cafe.g";
import { CafeRequest } from "../../core/api/generated/dto/CafeRequest.g";
import { Product } from "../../core/api/generated/dto/Product.g";
import { requestsRepository } from "../../core/api/requestsRepository";
import { CoreActions } from "../../core/store";
import { IAppState } from "../../core/store/AppState";
import Toast from "react-native-simple-toast";
import { localization } from "../../common/localization/localization";
import { setFavoriteAsync, unsetFavoriteAsync } from "../favoritesDrinks/favoriteDrinksSlice";

export interface ICurrentCafeState {
  loading: boolean;
  currentCafe: Cafe | null;
  drinks: Product[];
}

export const CurrentCafeInitialState: ICurrentCafeState = {
  loading: false,
  currentCafe: null,
  drinks: []
};

const currentCafeSlice = createSlice({
  name: "CurrentCafe",
  initialState: CurrentCafeInitialState,
  reducers: {
    setCurrentCafe: (state, action: PayloadAction<Cafe>) => {
      state.currentCafe = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getProductsCafeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsCafeAsync.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.drinks = action.payload;
      })
      .addCase(getProductsCafeAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(setFavoriteAsync.pending, (state, action) => {
        const drink = state.drinks.find(t => t.id == action.meta.arg.productId);
        if (drink)
          drink.favorite = true;
      })
      .addCase(setFavoriteAsync.rejected, (state, action) => {
        const drink = state.drinks.find(t => t.id == action.meta.arg.productId);
        if (drink)
          drink.favorite = false;
      })
      .addCase(unsetFavoriteAsync.pending, (state, action) => {
        const drink = state.drinks.find(t => t.id == action.meta.arg.productId);
        if (drink)
          drink.favorite = false;
      })
      .addCase(unsetFavoriteAsync.rejected, (state, action) => {
        const drink = state.drinks.find(t => t.id == action.meta.arg.productId);
        if (drink)
          drink.favorite = true;
      })
  }
});

function rehydrateHandler(state: ICurrentCafeState, action: PayloadAction<IAppState>): ICurrentCafeState {
  return {...CurrentCafeInitialState};
}

export const getProductsCafeAsync = createAsyncThunk<Product[], CafeRequest>(
  "CurrentCafe/GetProducts",
 async (cafeRequest: CafeRequest, { rejectWithValue }) => {
  try {
    const products = await requestsRepository.productApiRequest.getProductsCafe(cafeRequest);
    return products;
  }
  catch (error: any) {
    Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
    return rejectWithValue({});
  }
 }
)

export const { setCurrentCafe } = currentCafeSlice.actions;
export default currentCafeSlice.reducer;