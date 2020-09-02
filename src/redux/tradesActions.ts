import { Dispatch } from "redux";
import { createWebSocket } from "../utils/websocket"


export enum TradesActionType {
  TradesInitStart = "TradesInitStart",
  TradesInitSuccess = "TradesInitSuccess",
  TradesInitError = "TradesInitError",
  TradesDataUpdate = "TradesDataUpdate",
  TradesDispose = "TradesDispose"
}

/**
 * TODO would probably prefer having
 * a websocker ref in React component instead.
 */
let closeWebSocket: () => void;


export const TradesInit = (pair: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(TradesInitStart());

    try {
      const payload = {
        "event": "subscribe",
        "channel": "trades",
        "symbol": pair
      };

      const dispatchCallback = (data: any[]) => dispatch(TradesDataUpdate(data));

      closeWebSocket = createWebSocket(payload, dispatchCallback);

      dispatch(TradesInitSuccess());
    }
    catch (ex) {
      console.error(ex);
    }
  };
};

const TradesInitStart = () => {
  return {
    type: TradesActionType.TradesInitStart
  } as const;
};

const TradesInitSuccess = () => {
  return {
    type: TradesActionType.TradesInitSuccess
  } as const;
};

const TradesDataUpdate = (data: {}) => {
  return {
    type: TradesActionType.TradesDataUpdate,
    data
  } as const;
};


export const TradesDispose = () => {
  closeWebSocket();

  return {
    type: TradesActionType.TradesDispose
  } as const;
};