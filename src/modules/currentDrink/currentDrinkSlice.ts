import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductFull } from "../../core/api/generated/dto/ProductFull.g";
import { ProductRequest } from "../../core/api/generated/dto/ProductRequest.g";
import { requestsRepository } from "../../core/api/requestsRepository";
import { CoreActions } from "../../core/store";
import Toast from "react-native-simple-toast";
import { localization } from "../../common/localization/localization";
import { setFavoriteAsync, unsetFavoriteAsync } from "../favoritesDrinks/favoriteDrinksSlice";
import { Product } from "../../core/api/generated/dto/Product.g";

export interface ICurrentDrinkState {
  loading: boolean;
  currentDrink: Product | null;
  currentDrinkFull: ProductFull | null;
}

export const CurrentDrinkInitialState: ICurrentDrinkState = {
  loading: false,
  currentDrink: null,
  currentDrinkFull: null
}

const currentDrinkSlice = createSlice({
  name: "CurrentDrink",
  initialState: CurrentDrinkInitialState,
  reducers: {
    setCurrentDrink: (state, action: PayloadAction<Product>) => {
      state.currentDrink = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getProductFullAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductFullAsync.fulfilled, (state, action: PayloadAction<ProductFull>) => {
        state.loading = false;
        state.currentDrinkFull = action.payload;
      })
      .addCase(getProductFullAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(setFavoriteAsync.pending, (state, action) => {
        if (state.currentDrinkFull && state.currentDrinkFull.id == action.meta.arg.productId)
          state.currentDrinkFull.favarite = true;
      })
      .addCase(setFavoriteAsync.rejected, (state, action) => {
        if (state.currentDrinkFull && state.currentDrinkFull.id == action.meta.arg.productId)
          state.currentDrinkFull.favarite = false;
      })
      .addCase(unsetFavoriteAsync.pending, (state, action) => {
        if (state.currentDrinkFull && state.currentDrinkFull.id == action.meta.arg.productId)
          state.currentDrinkFull.favarite = false;
      })
      .addCase(unsetFavoriteAsync.rejected, (state, action) => {
        if (state.currentDrinkFull && state.currentDrinkFull.id == action.meta.arg.productId)
          state.currentDrinkFull.favarite = true;
      })
  }
});

function rehydrateHandler(): ICurrentDrinkState {
  return { ...CurrentDrinkInitialState };
}

export const getProductFullAsync = createAsyncThunk<ProductFull, ProductRequest>(
  "CurrentDrink/GetCurrentFull",
  async (productRequest: ProductRequest, { rejectWithValue }) => {
    try {
      const product = await requestsRepository.productApiRequest.getProduct(productRequest);
      return product;
    }
    catch (error: any) {
      Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
      return rejectWithValue({});
    }
  }
);

export const { setCurrentDrink } = currentDrinkSlice.actions;

export default currentDrinkSlice.reducer;