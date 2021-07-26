import { Dispatch, AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "../reducer";
import { getOrderBookSelector } from "../selectors";
import { createWebSocket } from "../utils/websocket";

export enum OrderBookActionType {
  OrderBookFetchStart = "OrderBookFetchStart",
  OrderBookFetchSuccess = "OrderBookFetchSuccess",
  OrderBookFetchError = "OrderBookFetchError",
  OrderBookDataUpdate = "OrderBookDataUpdate",
  OrderBookDecreasePrecision = "OrderBookDecreasePrecision",
  OrderBookDispose = "OrderBookDispose",
  OrderBookSimulateConnectionIssue = "OrderBookSimulateConnectionIssue",
}

let closeWebSocket: (reconnect?: boolean) => void;

export const getWebSocketDefaultPayload = (pair: string) => ({
  event: "subscribe",
  channel: "book",
  symbol: pair,
  prec: "P0",
  //"freq": "F1",
  len: 25,
});

export type WebSocketPayload = ReturnType<typeof getWebSocketDefaultPayload>;

export const OrderBookInit = (pair: string) => {
  return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    const payload = getWebSocketDefaultPayload(pair);

    dispatch(OrderBookFetch(payload));
  };
};

const OrderBookFetch = (payload: WebSocketPayload) => {
  return async (dispatch: Dispatch) => {
    if (closeWebSocket) {
      closeWebSocket();
    }

    dispatch(OrderBookFetchStart(payload));

    try {
      const dispatchCallback = (data: any[]) =>
        dispatch(OrderBookDataUpdate(data));

      closeWebSocket = createWebSocket(payload, dispatchCallback);

      dispatch(OrderBookFetchSuccess());
    } catch (ex) {
      console.error(ex);
    }
  };
};

const OrderBookFetchStart = (payload: WebSocketPayload) => {
  return {
    type: OrderBookActionType.OrderBookFetchStart,
    data: payload,
  } as const;
};

const OrderBookFetchSuccess = () => {
  return {
    type: OrderBookActionType.OrderBookFetchSuccess,
  } as const;
};

export const OrderBookDecreasePrecision = () => {
  return async (
    dispatch: ThunkDispatch<any, any, AnyAction>,
    getState: () => IRootState
  ) => {
    const currentPayload = getOrderBookSelector(getState()).payload!;
    const prec = getDecreasedPrecision(currentPayload.prec);
    const payload = { ...currentPayload, prec };

    dispatch(OrderBookFetch(payload));
  };
};

export const OrderBookIncreasePrecision = () => {
  return async (
    dispatch: ThunkDispatch<any, any, AnyAction>,
    getState: () => IRootState
  ) => {
    const currentPayload = getOrderBookSelector(getState()).payload!;
    const prec = getIncreasedPrecision(currentPayload.prec);
    const payload = { ...currentPayload, prec };

    dispatch(OrderBookFetch(payload));
  };
};

export const OrderBookDataUpdate = (data: {}) => {
  return {
    type: OrderBookActionType.OrderBookDataUpdate,
    data,
  } as const;
};

export const OrderBookDispose = () => {
  closeWebSocket();

  return {
    type: OrderBookActionType.OrderBookDispose,
  } as const;
};

export const OrderBookSimulateConnectionIssue = () => {
  const reconnect = true;
  closeWebSocket(reconnect);

  return {
    type: OrderBookActionType.OrderBookSimulateConnectionIssue,
  } as const;
};

const getDecreasedPrecision = (currentPrecision: string): string => {
  const results = new Map();
  results.set("P0", "P0");
  results.set("P1", "P0");
  results.set("P2", "P1");
  results.set("P3", "P2");
  results.set("P4", "P3");

  return results.get(currentPrecision) || "P0";
};

const getIncreasedPrecision = (currentPrecision: string): string => {
  const results = new Map();
  results.set("P0", "P1");
  results.set("P1", "P2");
  results.set("P2", "P3");
  results.set("P3", "P4");
  results.set("P4", "P4");

  return results.get(currentPrecision) || "P0";
};
