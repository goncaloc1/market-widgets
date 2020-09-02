import { TickerActionType } from './actions'
import { IRootState } from "../reducer";
import { AnyAction } from 'redux';

export const getTickerSelector = (state: IRootState): ITickerState => state.ticker;


export interface ITickerState {
  loading: boolean,
  data: number[]
}

export const getTickerInitialState = (): ITickerState => ({
  loading: true,
  data: []
});


export const tickerReducer = (state = getTickerInitialState(), action: AnyAction): ITickerState => {
  switch (action.type) {
    case TickerActionType.TickerInitStart: {
      return getTickerInitialState();
    }
    case TickerActionType.TickerInitSuccess: {
      return { ...state };
    }
    case TickerActionType.TickerDataUpdate: {
      const { data } = action;

      if (data.event === "subscribed") {
        return { ...state, loading: false };
      }
      else if (Array.isArray(data) && data[1] !== "hb") {
        return { ...state, data: data[1] };
      }

      return state;
    }

    case TickerActionType.TickerDispose: {
      return state;
    }
    default:
      // TODO throw error
      return state;
  }
}