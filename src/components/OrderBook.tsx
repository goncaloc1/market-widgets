import { useCallback, useEffect } from "react";
import { AnyAction } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { OrderBookControls } from "./OrderBookControls";
import { OrderBookBars } from "./OrderBookBars";
import {
  orderBookInit,
  orderBookDispose,
  orderBookSimulateConnectionIssue,
  getWebSocketDefaultPayload,
} from "../redux/orderBookActions";

import { getOrderBookSelector, getLoadingSelector } from "../selectors";
import { ThunkDispatch } from "redux-thunk";
import { IPriceLevel } from "../redux/orderBookHelpers";
import { RootState } from "../redux/store";
import { ConnectionIssueButton } from "./ConnectionIssueButton";
import { OrderBookItem } from "./OrderBookItem";

const getBarsCount = () => {
  const { len: numberOfPricePoints } = getWebSocketDefaultPayload("");
  return numberOfPricePoints - 5;
};

/**
 * Typically we get 25 results for each bids and asks price levels.
 * But when we have to delete a price level (due to count === 0)
 * we'd introduce visual flickering because we'd have
 * 24 results - sometimes less - instead of the 25.
 * Solution here is to add a buffer of 5 to avoid that.
 */
const barsCount = getBarsCount();

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

  const triggerConnectionIssue = useCallback(() => {
    dispatch(orderBookSimulateConnectionIssue());
  }, [dispatch]);

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

                <OrderBookBars isBids={true} barsCount={barsCount} />

                {state.bidsData.map(
                  (priceLevel: IPriceLevel, idx) =>
                    idx < barsCount && (
                      <OrderBookItem isBids={true} priceLevel={priceLevel} />
                    )
                )}
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

                <OrderBookBars isBids={false} barsCount={barsCount} />

                {state.asksData.map(
                  (priceLevel: IPriceLevel, idx) =>
                    idx < barsCount && (
                      <OrderBookItem isBids={false} priceLevel={priceLevel} />
                    )
                )}
              </div>
            </div>
          </div>

          <ConnectionIssueButton
            connected={state.connected}
            triggerConnectionIssue={triggerConnectionIssue}
          />
        </div>
      )}
    </>
  );
}

export { OrderBook };
