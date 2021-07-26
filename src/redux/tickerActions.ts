import { Dispatch } from "redux";
import { createWebSocket } from "../utils/websocket";

export enum TickerActionType {
  TickerInitStart = "TickerInitStart",
  TickerInitSuccess = "TickerInitSuccess",
  TickerInitError = "TickerInitError",
  TickerDataUpdate = "TickerDataUpdate",
  TickerDispose = "TickerDispose",
}

let closeWebSocket: (reconnect?: boolean) => void;

export const TickerInit = (pair: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(TickerInitStart());

    try {
      const subscribePayload = {
        event: "subscribe",
        channel: "ticker",
        symbol: pair,
      };

      const handleDataUpdate = (data: any[]) =>
        dispatch(TickerDataUpdate(data));

      closeWebSocket = createWebSocket(
        "wss://api-pub.bitfinex.com/ws/2",
        subscribePayload,
        handleDataUpdate
      );

      dispatch(TickerInitSuccess());
    } catch (ex) {
      console.error(ex);
    }
  };
};

const TickerInitStart = () => {
  return {
    type: TickerActionType.TickerInitStart,
  } as const;
};

const TickerInitSuccess = () => {
  return {
    type: TickerActionType.TickerInitSuccess,
  } as const;
};

export const TickerDataUpdate = (data: {}) => {
  return {
    type: TickerActionType.TickerDataUpdate,
    data,
  } as const;
};

export const TickerDispose = () => {
  closeWebSocket();

  return {
    type: TickerActionType.TickerDispose,
  } as const;
};
