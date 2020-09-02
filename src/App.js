import React from 'react';
import './App.css';
import Loading from './components/Loading'
import { Ticker } from './components/Ticker'
import { useSelector } from 'react-redux'
import { getTickerSelector } from './redux/reducer'

function App() {

  const state = useSelector(getTickerSelector);

  return (
    <>
      <Ticker pair="BTCUSD" />

      <Loading loading={state.loading} />
    </>
  );
}

export default App;