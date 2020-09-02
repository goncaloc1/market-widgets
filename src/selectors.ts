import { IRootState } from "./reducer";
import { ITickerState } from "./redux/tickerReducer";
import { ITradesState } from "./redux/tradesReducer";
import { IOrderBookState } from "./redux/orderBookReducer";

export const getTickerSelector = (state: IRootState): ITickerState => state.ticker;

export const getTradesSelector = (state: IRootState): ITradesState => state.trades;

export const getOrderBookSelector = (state: IRootState): IOrderBookState => state.orderBook;

export const getLoadingSelector = (state: IRootState): boolean =>
  getTickerSelector(state).loading ||
  getTradesSelector(state).loading ||
  getOrderBookSelector(state).loading;