import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tickerInit, tickerDataUpdate } from "./tickerActions";

export interface ITickerState {
  loading: boolean;
  data: number[];
}

export const getTickerInitialState = (): ITickerState => ({
  loading: true,
  data: [],
});

export const tickerSlice = createSlice({
  name: "ticker",
  initialState: getTickerInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tickerInit.pending, () => {
        return getTickerInitialState();
      })
      .addCase(tickerDataUpdate, (state, action: PayloadAction<any>) => {
        const { payload: data } = action;

        if (data.event === "subscribed") {
          return { ...state, loading: false };
        } else if (Array.isArray(data) && data[1] !== "hb") {
          return { ...state, data: data[1] };
        }

        return state;
      });
  },
});
