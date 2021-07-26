import { createWebSocket } from "../utils/websocket";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

let closeWebSocket: (reconnect?: boolean) => void;

/**
 * The only reason why we need an async thunk here
 * is to access dispatch function
 */
export const tickerInit = createAsyncThunk(
  "ticker/init",
  (pair: string, thunkAPI) => {
    try {
      const subscribePayload = {
        event: "subscribe",
        channel: "ticker",
        symbol: pair,
      };

      const handleDataUpdate = (data: any[]) =>
        thunkAPI.dispatch(tickerDataUpdate(data));

      closeWebSocket = createWebSocket(
        "wss://api-pub.bitfinex.com/ws/2",
        subscribePayload,
        handleDataUpdate
      );
    } catch (ex) {
      thunkAPI.rejectWithValue(ex);
    }
  }
);

/**
 * Action defined here and not in the slice to avoid circular dependency
 * `tickerDataUpdate` is dispatched in `tickerInit`
 */
export const tickerDataUpdate = createAction<any>("ticker/dataUpdate");

export const tickerDispose = () => {
  closeWebSocket();

  return {
    type: "ticker/dispose",
  };
};
