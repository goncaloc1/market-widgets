import { ITickerState } from "./redux/tickerReducer";
import { ITradesState } from "./redux/tradesReducer";
import { IOrderBookState } from "./redux/orderBookReducer";
import { RootState } from "./redux/store";

export const getTickerSelector = (state: RootState): ITickerState =>
  state.ticker;

export const getTradesSelector = (state: RootState): ITradesState =>
  state.trades;

export const getOrderBookSelector = (state: RootState): IOrderBookState =>
  state.orderBook;

export const getLoadingSelector = (state: RootState): boolean =>
  getTickerSelector(state).loading ||
  getTradesSelector(state).loading ||
  getOrderBookSelector(state).loading;
