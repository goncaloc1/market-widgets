import { combineReducers } from 'redux'
import { ITickerState, getTickerInitialState, tickerReducer } from './redux/reducer'


export interface IRootState {
  ticker: ITickerState
}

export const getRootInitialState = (): IRootState => ({
  ticker: getTickerInitialState()
});

export const rootReducer = combineReducers({
  ticker: tickerReducer
})