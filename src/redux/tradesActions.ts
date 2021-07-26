import { Dispatch } from "redux";
import { createWebSocket } from "../utils/websocket";

export enum TradesActionType {
  TradesInitStart = "TradesInitStart",
  TradesInitSuccess = "TradesInitSuccess",
  TradesInitError = "TradesInitError",
  TradesDataUpdate = "TradesDataUpdate",
  TradesDispose = "TradesDispose",
  TradesSimulateConnectionIssue = "TradesSimulateConnectionIssue",
  TradesConnectedChange = "TradesConnectedChange",
}

let closeWebSocket: (reconnect?: boolean) => void;

export const TradesInit = (pair: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(TradesInitStart());

    try {
      const subscribePayload = {
        event: "subscribe",
        channel: "trades",
        symbol: pair,
      };

      const handleDataUpdate = (data: any[]) =>
        dispatch(TradesDataUpdate(data));

      const handleConnectedChange = (connected: boolean) =>
        dispatch(TradesConnectedChange(connected));

      closeWebSocket = createWebSocket(
        "wss://api-pub.bitfinex.com/ws/2",
        subscribePayload,
        handleDataUpdate,
        handleConnectedChange
      );

      dispatch(TradesInitSuccess());
    } catch (ex) {
      console.error(ex);
    }
  };
};

const TradesInitStart = () => {
  return {
    type: TradesActionType.TradesInitStart,
  } as const;
};

const TradesInitSuccess = () => {
  return {
    type: TradesActionType.TradesInitSuccess,
  } as const;
};

const TradesDataUpdate = (data: {}) => {
  return {
    type: TradesActionType.TradesDataUpdate,
    data,
  } as const;
};

export const TradesDispose = () => {
  closeWebSocket();

  return {
    type: TradesActionType.TradesDispose,
  } as const;
};

export const TradesSimulateConnectionIssue = () => {
  const reconnect = true;
  closeWebSocket(reconnect);

  return {
    type: TradesActionType.TradesSimulateConnectionIssue,
  } as const;
};

export const TradesConnectedChange = (connected: boolean) => {
  return {
    type: TradesActionType.TradesConnectedChange,
    data: { connected },
  } as const;
};
