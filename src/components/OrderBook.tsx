import React, { useEffect } from "react";
import { AnyAction } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { OrderBookControls } from "./OrderBookControls";
import { OrderBookBars } from "./OrderBookBars";
import {
  OrderBookInit,
  OrderBookDispose,
  OrderBookSimulateConnectionIssue,
} from "../redux/orderBookActions";
import { IPriceLevel } from "../redux/orderBookReducer";
import { getOrderBookSelector, getLoadingSelector } from "../selectors";
import { ThunkDispatch } from "redux-thunk";

function OrderBook(props: { pair: string }) {
  const loading = useSelector(getLoadingSelector);
  const state = useSelector(getOrderBookSelector);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  useEffect(() => {
    dispatch(OrderBookInit(props.pair));

    return () => {
      dispatch(OrderBookDispose());
    };
  }, [dispatch, props.pair]);

  const simulateConnectionIssue = () => {
    if (state.connected) {
      dispatch(OrderBookSimulateConnectionIssue());
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
