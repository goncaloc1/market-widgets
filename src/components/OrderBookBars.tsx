import React from "react";
import { useSelector } from "react-redux";
import { IPriceLevel } from "../redux/orderBookHelpers";
import { getOrderBookSelector } from "../selectors";

const getWidth = (total: number, maxTotal: number) => (total * 100) / maxTotal;

function OrderBookBars(props: { isBids: boolean; barsCount: number }) {
  const state = useSelector(getOrderBookSelector);

  const getData = () => (props.isBids ? state.bidsData : state.asksData);

  /**
   * data is ordered so we're sure to obtain max total by accessing the last index
   */
  const maxTotal = getData()[props.barsCount - 1].total;

  return (
    <svg
      className={`${props.isBids ? "bids-" : "asks-"}orderbook-bars-container`}
    >
      {getData().map((priceLevel: IPriceLevel, idx: number) => {
        return (
          idx < props.barsCount && (
            <rect
              key={priceLevel.price}
              x="1"
              y={idx * 20}
              width={`${getWidth(priceLevel.total, maxTotal)}%`}
              height="20"
              fillOpacity="0.2"
            ></rect>
          )
        );
      })}
    </svg>
  );
}

export { OrderBookBars };
