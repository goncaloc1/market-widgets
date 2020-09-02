import React, { useEffect } from 'react';
import { AnyAction } from "redux";
import { useSelector, useDispatch } from 'react-redux'
import { TickerInit, TickerDispose } from '../redux/actions'
import { getTickerSelector } from '../redux/reducer'
import { ThunkDispatch } from 'redux-thunk';

function Ticker(props: { pair: string }) {

  const state = useSelector(getTickerSelector);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  useEffect(() => {
    dispatch(TickerInit(props.pair));

    return () => {
      dispatch(TickerDispose());
    }
  }, [dispatch]);

  return (
    <>
      {/* TODO take toLocaString logic and similar our of here */}
      {!state.loading && state.data.length > 0 &&
        <div className="row w-25">
          <div className="col-2">
            {/* TODO change image according to pair */}
            <img src="https://www.bitfinex.com/assets/BTC-alt-631a4985ef5564fba7508526f8952ba54cd598318506bee963cc9b6d00600278.svg" alt="crypto-icon" className="img-thumbnail border-0" />
          </div>
          <div className="col-5">
            <div className="">{props.pair}</div>
            <div className="small">VOL {(state.data[7] * state.data[6]).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="small">LOW {state.data[9].toLocaleString()}</div>
          </div>
          <div className="col-5">
            <div className="">{state.data[6].toLocaleString()}</div>
            <div className={"small " + (state.data[5] >= 0 ? "text-success" : "text-danger")}>{state.data[4]} {(state.data[5] * 100).toFixed(2)}%</div>
            <div className="small">HIGH {state.data[8].toLocaleString()}</div>
          </div>
        </div>
      }
    </>
  );
}

export { Ticker };