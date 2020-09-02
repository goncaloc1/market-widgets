import { Dispatch } from "redux";
import { createWebSocket } from "../utils/websocket"


export enum OrderBookActionType {
  OrderBookInitStart = "OrderBookInitStart",
  OrderBookInitSuccess = "OrderBookInitSuccess",
  OrderBookInitError = "OrderBookInitError",
  OrderBookDataUpdate = "OrderBookDataUpdate",
  OrderBookDispose = "OrderBookDispose"
}

/**
 * TODO would probably prefer having
 * a websocker ref in React component instead.
 */
let closeWebSocket: () => void;


export const OrderBookInit = (pair: string) => {
  return async (dispatch: Dispatch) => {
    const nPricePoints = 25;

    dispatch(OrderBookInitStart(nPricePoints));

    try {
      const payload = {
        "event": "subscribe",
        "channel": "book",
        "symbol": pair,
        "prec": "P0",
        //"freq": "F1",
        "len": nPricePoints
      };

      const dispatchCallback = (data: any[]) => dispatch(OrderBookDataUpdate(data));

      closeWebSocket = createWebSocket(payload, dispatchCallback);

      dispatch(OrderBookInitSuccess());
    }
    catch (ex) {
      console.error(ex);
    }
  };
};

const OrderBookInitStart = (nPricePoints: number) => {
  return {
    type: OrderBookActionType.OrderBookInitStart,
    data: nPricePoints
  } as const;
};

const OrderBookInitSuccess = () => {
  return {
    type: OrderBookActionType.OrderBookInitSuccess
  } as const;
};

const OrderBookDataUpdate = (data: {}) => {
  return {
    type: OrderBookActionType.OrderBookDataUpdate,
    data
  } as const;
};


export const OrderBookDispose = () => {
  closeWebSocket();

  return {
    type: OrderBookActionType.OrderBookDispose
  } as const;
};