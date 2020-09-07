import React from 'react';
import { AnyAction } from "redux";
import { useSelector, useDispatch } from 'react-redux'
import { OrderBookDecreasePrecision, OrderBookIncreasePrecision } from '../redux/orderBookActions'
import { getOrderBookSelector } from '../selectors'
import { ThunkDispatch } from 'redux-thunk';


function OrderBookControls() {

  const state = useSelector(getOrderBookSelector);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  const decreasePrecision = () => dispatch(OrderBookDecreasePrecision());

  const increasePrecision = () => dispatch(OrderBookIncreasePrecision());

  return (
    <div className="btn-group" aria-label="Precision">
      <button type="button" className="btn btn-link btn-sm"
        onClick={decreasePrecision}
        disabled={state.payload!.prec === "P0"}>-
      </button>

      <button type="button" className="btn btn-link btn-sm"
        onClick={increasePrecision}
        disabled={state.payload!.prec === "P4"}>+
      </button>
    </div>
  );
}

export { OrderBookControls };