import { getOrderBookSelector } from "../selectors";
import { createWebSocket } from "../utils/websocket";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDecreasedPrecision,
  getIncreasedPrecision,
} from "./orderBookHelpers";
import { RootState } from "./store";

let closeWebSocket: (reconnect?: boolean) => void;

export const getWebSocketDefaultPayload = (pair: string) => ({
  event: "subscribe",
  channel: "book",
  symbol: pair,
  prec: "P2",
  //"freq": "F1",
  /**
   * Number of price points ("1", "25", "100", "250") [default="25"]
   */
  len: 25,
});

export type WebSocketPayload = ReturnType<typeof getWebSocketDefaultPayload>;

export const orderBookInit = createAsyncThunk(
  "orderBook/init",
  (pair: string, thunkAPI) => {
    const payload = getWebSocketDefaultPayload(pair);

    thunkAPI.dispatch(orderBookFetch(payload));
  }
);

export const orderBookFetch = createAsyncThunk(
  "orderBook/fetch",
  (subscribePayload: WebSocketPayload, thunkAPI) => {
    if (closeWebSocket) {
      closeWebSocket();
    }

    try {
      const handleDataUpdate = (data: any[]) =>
        thunkAPI.dispatch(orderBookDataUpdate(data));

      const handleConnectedChange = (connected: boolean) =>
        thunkAPI.dispatch(orderBookConnectedChange(connected));

      closeWebSocket = createWebSocket(
        "wss://api-pub.bitfinex.com/ws/2",
        subscribePayload,
        handleDataUpdate,
        handleConnectedChange
      );
    } catch (ex) {
      thunkAPI.rejectWithValue(ex);
    }
  }
);

export const orderBookDecreasePrecision = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("orderBook/decreasePrecision", (_, thunkAPI) => {
  const currentPayload = getOrderBookSelector(thunkAPI.getState()).payload!;
  const prec = getDecreasedPrecision(currentPayload.prec);
  const payload = { ...currentPayload, prec };

  thunkAPI.dispatch(orderBookFetch(payload));
});

export const orderBookIncreasePrecision = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("orderBook/increasePrecision", (_, thunkAPI) => {
  const currentPayload = getOrderBookSelector(thunkAPI.getState()).payload!;
  const prec = getIncreasedPrecision(currentPayload.prec);
  const payload = { ...currentPayload, prec };

  thunkAPI.dispatch(orderBookFetch(payload));
});

/**
 * Action defined here and not in the slice to avoid circular dependency
 * `orderBookDataUpdate` is dispatched in `orderBookFetch`
 */
export const orderBookDataUpdate = createAction<any>("orderBook/dataUpdate");

export const orderBookDispose = () => {
  closeWebSocket();

  return {
    type: "orderBook/dispose",
  };
};

export const orderBookSimulateConnectionIssue = () => {
  const reconnect = true;
  closeWebSocket(reconnect);

  return {
    type: "orderBook/simulateConnectionIssue",
  };
};

export const orderBookConnectedChange = createAction(
  "orderBook/connectedChange",
  (connected: boolean) => ({ payload: { connected } })
);
