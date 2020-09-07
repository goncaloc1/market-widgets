import React, { useEffect } from 'react';
import { AnyAction } from "redux";
import { useSelector, useDispatch } from 'react-redux'
import { TradesInit, TradesDispose } from '../redux/tradesActions'
import { getTradesSelector, getLoadingSelector } from '../selectors'
import { ThunkDispatch } from 'redux-thunk';
import moment from 'moment';


function Trades(props: { pair: string }) {

  const loading = useSelector(getLoadingSelector);
  const state = useSelector(getTradesSelector);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  useEffect(() => {
    dispatch(TradesInit(props.pair));

    return () => {
      dispatch(TradesDispose());
    }
  }, [dispatch, props.pair]);

  const connectDisconnect = () => {
    if (state.connected) {
      dispatch(TradesDispose());
    }
    else {
      dispatch(TradesInit(props.pair));
    }
  }

  return (
    <>
      {/* TODO take toLocaleString logic and similar out of here */}
      {!loading && state.data.length > 0 &&
        <div className="trades-container w-25">
          <div className="small">
            <div className="row border-bottom">
              <div className="col-sm-1"></div>
              <div className="col-sm">TIME</div>
              <div className="col-sm text-right">PRICE</div>
              <div className="col-sm text-right">AMOUNT</div>
            </div>

            {state.data.map((trade: any) => (
              <div className="row border-bottom" key={trade[0]}>
                {trade[2] >= 0 && <div className="col-sm-1 text-success">&#8593;</div>}
                {trade[2] < 0 && <div className="col-sm-1 text-danger">&#8595;</div>}
                <div className="col-sm">{moment(trade[1]).format("hh:mm:ss")}</div>
                <div className="col-sm text-right">{trade[3].toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="col-sm text-right">{Math.abs(trade[2]).toFixed(4)}</div>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-link btn-sm float-right mr-n2"
            id="trades-connect-disconnect"
            onClick={connectDisconnect}>{state.connected ? "Disconnect" : "Connect"}</button>
        </div>
      }
    </>
  );
}

export { Trades };