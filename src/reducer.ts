import { combineReducers } from 'redux'
import { ITickerState, getTickerInitialState, tickerReducer } from './redux/tickerReducer'
import { ITradesState, getTradesInitialState, tradesReducer } from './redux/tradesReducer'
import { IOrderBookState, getOrderBookInitialState, orderBookReducer } from './redux/orderBookReducer'


export interface IRootState {
  ticker: ITickerState,
  trades: ITradesState,
  orderBook: IOrderBookState
}

export const getRootInitialState = (): IRootState => ({
  ticker: getTickerInitialState(),
  trades: getTradesInitialState(),
  orderBook: getOrderBookInitialState()
});

export const rootReducer = combineReducers({
  ticker: tickerReducer,
  trades: tradesReducer,
  orderBook: orderBookReducer
})