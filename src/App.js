import React from 'react';
import './App.css';
import Loading from './components/Loading'
import { Ticker } from './components/Ticker'
import { Trades } from './components/Trades'
import { OrderBook } from './components/OrderBook'
import { useSelector } from 'react-redux'
import { getLoadingSelector } from './selectors'

function App() {

  const loading = useSelector(getLoadingSelector);

  // TODO set any pair
  const pair = "BTCUSD";

  return (
    <>
      <Ticker pair={pair} />
      <div className="mt-4"></div>
      <Trades pair={pair} />
      <div className="mt-4"></div>
      <OrderBook pair={pair} />
      <Loading loading={loading} />
    </>
  );
}

export default App;