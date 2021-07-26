import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { getRootInitialState, rootReducer } from '../../reducer'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { Ticker } from '../Ticker';
import { getTickerSelector } from '../../selectors'
import { tickerDataUpdate } from '../../redux/tickerActions'

/**
 * To avoid "MutationObserver is not a constructor".
 * More details here:
 * https://github.com/testing-library/dom-testing-library/releases/tag/v7.0.0
 */
import MutationObserver from '@sheerun/mutationobserver-shim'
window.MutationObserver = MutationObserver


describe('Ticker', () => {
  const pair = "BTCUSD";

  /**
   * Debatable, but I think init function is
   * more flexible than beforeEach - we can return
   * whatever we want for instance.
   */
  const init = (initialState = getRootInitialState()) => {
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

    const utils = render(<Provider store={store}><Ticker pair={pair} /></Provider>);

    return [store, utils];
  }

  it('will be considered loaded when websocket is subscribed', async () => {
    let state, actionData;

    const [store] = init();

    state = getTickerSelector(store.getState());
    expect(state.loading).toBe(true);

    actionData = { event: "subscribed" };
    store.dispatch(tickerDataUpdate(actionData));

    state = getTickerSelector(store.getState());
    expect(state.loading).toBe(false);
  })

  it('will render Ticker once first data is obtained from websocket', async () => {
    let actionData;

    const initialState = getRootInitialState();
    initialState.trades.loading = false;        // TODO: dependency with other states, fix it.
    initialState.orderBook.loading = false;     // TODO: dependency with other states, fix it.

    const [store, { getByText }] = init(initialState);

    actionData = { event: "subscribed" };
    store.dispatch(tickerDataUpdate(actionData));

    expect(screen.queryByText(pair)).not.toBeInTheDocument();

    actionData = [0, [0, 0, 0, 0, 113, 0.0106, 10793, 4733.26937078, 10944, 10637]];
    store.dispatch(tickerDataUpdate(actionData));

    expect(getByText(pair)).toBeInTheDocument();

    expect(getByText("VOL 51,086,176")).toBeInTheDocument();
    expect(getByText("LOW 10,637")).toBeInTheDocument();
    expect(getByText("10,793")).toBeInTheDocument();
    expect(getByText("113 1.06%")).toBeInTheDocument();
    expect(getByText("HIGH 10,944")).toBeInTheDocument();
  })

  it('will not render Ticker while other components are still loading - not correct, fix this)', async () => {
    let actionData;

    const [store] = init();

    actionData = { event: "subscribed" };
    store.dispatch(tickerDataUpdate(actionData));

    actionData = [0, [0, 0, 0, 0, 113, 0.0106, 10793, 4733.26937078, 10944, 10637]];
    store.dispatch(tickerDataUpdate(actionData));

    expect(screen.queryByText(pair)).not.toBeInTheDocument();
  })

  it('will update Ticker data', async () => {
    let actionData;
    const initialState = getRootInitialState();
    initialState.trades.loading = false;        // TODO: dependency with other states, fix it.
    initialState.orderBook.loading = false;     // TODO: dependency with other states, fix it.

    const [store, { getByText }] = init(initialState);

    actionData = { event: "subscribed" };
    store.dispatch(tickerDataUpdate(actionData));

    actionData = [0, [0, 0, 0, 0, 113, 0.0106, 1, 1, 1, 1]];
    store.dispatch(tickerDataUpdate(actionData));

    expect(getByText(pair)).toBeInTheDocument();
    expect(getByText("113 1.06%")).toBeInTheDocument();

    actionData = [0, [0, 0, 0, 0, 500, 0.0250, 1, 1, 1, 1]];
    store.dispatch(tickerDataUpdate(actionData));
    expect(getByText("500 2.50%")).toBeInTheDocument();
  })
});