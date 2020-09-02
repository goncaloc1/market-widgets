import { TradesActionType } from './tradesActions'
import { AnyAction } from 'redux';


export interface ITradesState {
  loading: boolean,
  connected: boolean,
  data: number[]
}

export const getTradesInitialState = (): ITradesState => ({
  loading: true,
  connected: false,
  data: []
});


export const tradesReducer = (state = getTradesInitialState(), action: AnyAction): ITradesState => {
  switch (action.type) {
    case TradesActionType.TradesInitStart: {
      return getTradesInitialState();
    }
    case TradesActionType.TradesInitSuccess: {
      return { ...state };
    }
    case TradesActionType.TradesDataUpdate: {
      const { data } = action;

      if (data.event === "subscribed") {
        console.log("trades websocket subscribed");
        return { ...state, connected: true };
      }
      else if (Array.isArray(data)) {
        if (data[1] === "te") {
          const fifo = [...state.data];
          fifo.pop();
          fifo.unshift(data[2]);
          return { ...state, data: fifo };
        }
        else if (Array.isArray(data[1])) {
          return { ...state, loading: false, data: data[1] };
        }
      }

      return state;
    }

    case TradesActionType.TradesDispose: {
      return { ...state, connected: false };
    }
    default:
      // TODO throw error
      return state;
  }
}