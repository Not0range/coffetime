import { store } from "../App";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;