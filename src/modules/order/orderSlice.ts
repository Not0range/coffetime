import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../core/api/generated/dto/Product.g";
import { ProductFull } from "../../core/api/generated/dto/ProductFull.g";
import { CoreActions } from "../../core/store";
import { OrderDrink } from "../../types/orderDrink";

export interface IOrderState {
  orderDrinks: OrderDrink[];
}

export const OrderInitialState: IOrderState = {
  orderDrinks: [],
}

const orderSlice = createSlice({
  name: "Order",
  initialState: OrderInitialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<{ drink: ProductFull, product: Product }>) => {
      if (!state.orderDrinks.some(t => t.drink.id == action.payload.drink.id))
        state.orderDrinks.push({
          drink: action.payload.drink,
          product: action.payload.product,
          count: 1
        });
    },
    removeFromOrder: (state, action: PayloadAction<string>) => {
      const drink = state.orderDrinks.findIndex(t => t.drink.id == action.payload);
      if (drink != -1)
        state.orderDrinks.splice(drink, 1);
    },
    clearOrder: (state) => {
      state.orderDrinks = [];
    },
    incrementOrder: (state, action: PayloadAction<string>) => {
      const drink = state.orderDrinks.findIndex(t => t.drink.id == action.payload);
      if (drink != -1)
        state.orderDrinks[drink].count++;
    },
    decrementOrder: (state, action: PayloadAction<string>) => {
      const drink = state.orderDrinks.findIndex(t => t.drink.id == action.payload);
      if (drink != -1 && state.orderDrinks[drink].count > 1)
        state.orderDrinks[drink].count--;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(CoreActions.rehydrate, rehydrateHandler)
  }
});

function rehydrateHandler(): IOrderState {
  return { ...OrderInitialState };
}

export const { addToOrder, removeFromOrder, clearOrder, incrementOrder, decrementOrder } = orderSlice.actions
export default orderSlice.reducer;