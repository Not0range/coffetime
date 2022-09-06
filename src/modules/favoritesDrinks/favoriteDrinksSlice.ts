import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { localization } from "../../common/localization/localization";
import { newState } from "../../common/newState";
import { Product } from "../../core/api/generated/dto/Product.g";
import { requestsRepository } from "../../core/api/requestsRepository";
import { actionCreator, CoreActions } from "../../core/store";
import { IAppState } from "../../core/store/AppState";
import Toast from "react-native-simple-toast";
import { ProductRequest } from "../../core/api/generated/dto/ProductRequest.g";

export interface IFavoriteDrinksState {
  loading: boolean;
  error: boolean;
  favoriteDrinks: Product[];
}

export const FavoriteDrinksInitialState: IFavoriteDrinksState = {
  loading: false,
  error: false,
  favoriteDrinks: []
}

const favoriteDrinksSlice = createSlice({
  name: "FavoriteDrinks",
  initialState: FavoriteDrinksInitialState,
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
      .addCase(getFavoriteDrinksAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getFavoriteDrinksAsync.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.error = false;
        state.favoriteDrinks = action.payload;
      })
      .addCase(getFavoriteDrinksAsync.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(setFavoriteAsync.fulfilled, (state, action: PayloadAction<string>) => {
        const drink = state.favoriteDrinks.find(t => t.id == action.payload);
        if (drink)
          drink.favorite = true;
      })
      .addCase(unsetFavoriteAsync.fulfilled, (state, action: PayloadAction<string>) => {
        const drink = state.favoriteDrinks.findIndex(t => t.id == action.payload);
        if (drink != -1)
          state.favoriteDrinks.splice(drink, 1);
      })
  }
})

function rehydrateHandler(): IFavoriteDrinksState {
  return {...FavoriteDrinksInitialState};
}

export const getFavoriteDrinksAsync = createAsyncThunk<Product[], string>(
  "FavoriteDrinks/Get",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const product = await requestsRepository.productApiRequest.getAll(sessionId);
      return product.filter(t => t.favorite);
    }
    catch (error: any) {
      Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
      return rejectWithValue({});
    }
  }
);

export const setFavoriteAsync = createAsyncThunk<string, ProductRequest>(
  "FavoriteDrinks/Unset",
  async (productRequest, { rejectWithValue }) => {
    try {
      const result = await requestsRepository.favoriteApiRequest.setFavorite(productRequest);
      if (result)
        return productRequest.productId;
      else
        return rejectWithValue(productRequest.productId);
    }
    catch (error: any) {
      Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
      return rejectWithValue(productRequest.productId)
    }
  }
);

export const unsetFavoriteAsync = createAsyncThunk<string, ProductRequest>(
  "FavoriteDrinks/Set",
  async (productRequest, { rejectWithValue }) => {
    try {
      const result = await requestsRepository.favoriteApiRequest.unsetFavorite(productRequest);
      if (result)
        return productRequest.productId;
      else
        return rejectWithValue(productRequest.productId);
    }
    catch (error: any) {
      Toast.show(`${localization.errors.listErrorTitle}: ${error.text}`);
      return rejectWithValue(productRequest.productId)
    }
  }
);

export default favoriteDrinksSlice.reducer;