import React, { useEffect } from "react";
import { AnyAction } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { OrderBookControls } from "./OrderBookControls";
import { OrderBookBars } from "./OrderBookBars";
import {
  orderBookInit,
  orderBookDispose,
  orderBookSimulateConnectionIssue,
} from "../redux/orderBookActions";

import { getOrderBookSelector, getLoadingSelector } from "../selectors";
import { ThunkDispatch } from "redux-thunk";
import { IPriceLevel } from "../redux/orderBookHelpers";
import { RootState } from "../redux/store";

function OrderBook(props: { pair: string }) {
  const loading = useSelector(getLoadingSelector);
  const state = useSelector(getOrderBookSelector);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  useEffect(() => {
    dispatch(orderBookInit(props.pair));

    return () => {
      dispatch(orderBookDispose());
    };
  }, [dispatch, props.pair]);

  const simulateConnectionIssue = () => {
    if (state.connected) {
      dispatch(orderBookSimulateConnectionIssue());
    }
  };

  return (
    <>
      {!loading && state.bidsData.length > 0 && (
        <div className="orderbook-container w-50">
          <div className="row float-right">
            <OrderBookControls />
          </div>

          <div className="row" style={{ clear: "both" }}>
            <div className="col-6">
              <div className="small">
                <div className="row border-bottom">
                  <div className="col-sm">COUNT</div>
                  <div className="col-sm">AMOUNT</div>
                  <div className="col-sm text-right">TOTAL</div>
                  <div className="col-sm text-right">PRICE</div>
                </div>

                <OrderBookBars isBids={true} />

                {state.bidsData.map((priceLevel: IPriceLevel) => (
                  <div className="row border-bottom" key={priceLevel.price}>
                    <div className="col-sm">{priceLevel.count}</div>
                    <div className="col-sm">{priceLevel.amountFormatted}</div>
                    <div className="col-sm text-right">
                      {priceLevel.totalFormatted}
                    </div>
                    <div className="col-sm text-right">
                      {priceLevel.priceFormatted}
                    </div>
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

                <OrderBookBars isBids={false} />

                {state.asksData.map((priceLevel: IPriceLevel) => (
                  <div className="row border-bottom" key={priceLevel.price}>
                    <div className="col-sm">{priceLevel.priceFormatted}</div>
                    <div className="col-sm">{priceLevel.totalFormatted}</div>
                    <div className="col-sm text-right">
                      {priceLevel.amountFormatted}
                    </div>
                    <div className="col-sm text-right">{priceLevel.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row float-right mr-n2">
            {state.connected ? (
              <button
                type="button"
                className="btn btn-link btn-sm"
                id="trades-connect-disconnect"
                onClick={simulateConnectionIssue}
              >
                Simulate Connection Issue
              </button>
            ) : (
              <small>Disconnected</small>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { OrderBook };
