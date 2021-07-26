import { combineReducers } from "redux";
import { getTickerInitialState, tickerSlice } from "./redux/tickerReducer";
import { getTradesInitialState, tradesReducer } from "./redux/tradesReducer";
import {
  getOrderBookInitialState,
  orderBookSlice,
} from "./redux/orderBookReducer";

export const getRootInitialState = () => ({
  ticker: getTickerInitialState(),
  trades: getTradesInitialState(),
  orderBook: getOrderBookInitialState(),
});

export const rootReducer = combineReducers({
  ticker: tickerSlice.reducer,
  trades: tradesReducer,
  orderBook: orderBookSlice.reducer,
});
