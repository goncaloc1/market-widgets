import React, { useEffect } from 'react';
import { AnyAction } from "redux";
import { useSelector, useDispatch } from 'react-redux'
import { OrderBookInit, OrderBookDispose } from '../redux/orderBookActions'
import { IPriceLevel } from '../redux/orderBookReducer'
import { getOrderBookSelector, getLoadingSelector } from '../selectors'
import { ThunkDispatch } from 'redux-thunk';


function OrderBook(props: { pair: string }) {

  const loading = useSelector(getLoadingSelector);
  const state = useSelector(getOrderBookSelector);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  useEffect(() => {
    dispatch(OrderBookInit(props.pair));

    return () => {
      dispatch(OrderBookDispose());
    }
  }, [dispatch, props.pair]);

  const connectDisconnect = () => {
    if (state.connected) {
      dispatch(OrderBookDispose());
    }
    else {
      dispatch(OrderBookInit(props.pair));
    }
  }

  return (
    <>
      {!loading && state.bidsData.length > 0 &&
        <div className="orderbook-container row w-50">
          <div className="col-6">

            <div className="small">
              <div className="row border-bottom">
                <div className="col-sm">COUNT</div>
                <div className="col-sm">AMOUNT</div>
                <div className="col-sm text-right">TOTAL</div>
                <div className="col-sm text-right">PRICE</div>
              </div>

              {state.bidsData.map((priceLevel: IPriceLevel) => (
                <div className="row border-bottom" key={priceLevel.price}>
                  <div className="col-sm">{priceLevel.count}</div>
                  <div className="col-sm">{priceLevel.amountFormatted}</div>
                  <div className="col-sm text-right">{priceLevel.totalFormatted}</div>
                  <div className="col-sm text-right">{priceLevel.priceFormatted}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-6">

            <div className="small">
              <div className="row border-bottom">
                <div className="col-sm">PRICE</div>
                <div className="col-sm">TOTAL</div>
                <div className="col-sm text-right">AMOUNT</div>
                <div className="col-sm text-right">COUNT</div>
              </div>

              {state.asksData.map((priceLevel: IPriceLevel) => (
                <div className="row border-bottom" key={priceLevel.price}>
                  <div className="col-sm">{priceLevel.priceFormatted}</div>
                  <div className="col-sm">{priceLevel.totalFormatted}</div>
                  <div className="col-sm text-right">{priceLevel.amountFormatted}</div>
                  <div className="col-sm text-right">{priceLevel.count}</div>
                </div>
              ))}

            </div>
            <button type="button" className="btn btn-link btn-sm float-right mr-n2"
              id="trades-connect-disconnect"
              onClick={connectDisconnect}>{state.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      }
    </>
  );
}

export { OrderBook };