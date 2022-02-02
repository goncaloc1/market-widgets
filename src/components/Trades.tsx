import React, { useCallback, useEffect } from "react";
import { AnyAction } from "redux";
import { useSelector, useDispatch } from "react-redux";
import {
  TradesInit,
  TradesDispose,
  TradesSimulateConnectionIssue,
} from "../redux/tradesActions";
import { getTradesSelector, getLoadingSelector } from "../selectors";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../redux/store";
import { ConnectionIssueButton } from "./ConnectionIssueButton";
import { TradeItem } from "./TradeItem";
import { Trade } from "../redux/tradesReducer";

const Trades = (props: { pair: string }) => {
  const loading = useSelector(getLoadingSelector);
  const state = useSelector(getTradesSelector);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  useEffect(() => {
    dispatch(TradesInit(props.pair));

    return () => {
      dispatch(TradesDispose());
    };
  }, [dispatch, props.pair]);

  const triggerConnectionIssue = useCallback(() => {
    dispatch(TradesSimulateConnectionIssue());
  }, [dispatch]);

  return (
    <>
      {/* TODO take toLocaleString logic and similar out of here */}
      {!loading && state.data.length > 0 && (
        <div className="trades-container w-25">
          <div className="small">
            <div className="row border-bottom">
              <div className="col-sm-1"></div>
              <div className="col-sm">TIME</div>
              <div className="col-sm text-right">PRICE</div>
              <div className="col-sm text-right">AMOUNT</div>
            </div>

            {state.data.map((trade: Trade) => (
              <TradeItem trade={trade} />
            ))}
          </div>

          <ConnectionIssueButton
            connected={state.connected}
            triggerConnectionIssue={triggerConnectionIssue}
          />
        </div>
      )}
    </>
  );
};

export { Trades };
