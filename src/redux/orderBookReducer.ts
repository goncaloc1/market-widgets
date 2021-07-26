import cloneDeep from "lodash/cloneDeep";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  orderBookConnectedChange,
  orderBookDataUpdate,
  orderBookFetch,
  WebSocketPayload,
} from "./orderBookActions";

import {
  addOrUpdatePriceLevel,
  initializePriceLevels,
  IPriceLevel,
  updateTotals,
} from "./orderBookHelpers";

export interface IOrderBookState {
  loading: boolean;
  payload?: WebSocketPayload;
  connected: boolean;
  bidsData: IPriceLevel[];
  asksData: IPriceLevel[];
}

export const getOrderBookInitialState = (): IOrderBookState => ({
  loading: true,
  payload: undefined,
  connected: false,
  bidsData: [],
  asksData: [],
});

export const orderBookSlice = createSlice({
  name: "orderBook",
  initialState: getOrderBookInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderBookFetch.pending, (state, action) => {
        const initial = getOrderBookInitialState();
        return { ...initial, payload: action.meta.arg };
      })
      /**
       * Note, didn't have time to optimize
       * OrderBookDataUpdate logic: performance and readability wise.
       * It's possible that it could get to simple O(n) time complexity.
       */
      .addCase(orderBookDataUpdate, (stateArg, action: PayloadAction<any>) => {
        const { payload: data } = action;
        /**
         * TODO I'm changing original state somewhere apparently.
         * Uncaught Error: [Immer] An immer producer returned a new value *and*
         * modified its draft. Either return a new value *or* modify the draft.
         */
        const state = cloneDeep(stateArg);

        if (data.event === "subscribed") {
          return { ...state };
        } else if (Array.isArray(data)) {
          if (data[1].length === 3) {
            const o = data[1];
            if (o[1] === 0) {
              if (o[2] === 1) {
                // remove from bids
                const newData = state.bidsData.filter(
                  (pl) => pl.price !== o[0]
                );
                const bidsData = updateTotals(newData);
                return { ...state, bidsData };
              } else {
                // remove from asks
                const newData = state.asksData.filter(
                  (pl) => pl.price !== o[0]
                );
                const asksData = updateTotals(newData);
                return { ...state, asksData };
              }
            } else if (o[1] > 0) {
              // add or update price level
              if (o[2] > 0) {
                // add/update bids
                const bidsData = addOrUpdatePriceLevel(o, state.bidsData, true);
                return { ...state, bidsData };
              } else if (o[2] < 0) {
                // add/update asks
                const asksData = addOrUpdatePriceLevel(
                  o,
                  state.asksData,
                  false
                );
                return { ...state, asksData };
              }
            }

            return { ...state };
          } else if (data[1].length === state.payload!.len * 2) {
            // Snapshot
            const [bidsData, asksData] = initializePriceLevels(
              state.payload!.len,
              data[1]
            );
            return { ...state, loading: false, bidsData, asksData };
          }
        }

        return state;
      })
      .addCase(orderBookConnectedChange, (state, action) => {
        return { ...state, connected: action.payload.connected };
      });
  },
});
