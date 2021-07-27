import React from "react";
import { useSelector } from "react-redux";
import { IPriceLevel } from "../redux/orderBookHelpers";
import { getOrderBookSelector } from "../selectors";

function OrderBookBars(props: { isBids: boolean; count: number }) {
  const state = useSelector(getOrderBookSelector);

  const getData = () => (props.isBids ? state.bidsData : state.asksData);

  return (
    <svg
      className={`${props.isBids ? "bids-" : "asks-"}orderbook-bars-container`}
    >
      {getData().map((priceLevel: IPriceLevel, idx: number) => {
        return (
          idx < props.count && (
            <rect
              key={priceLevel.price}
              x="1"
              y={idx * 20}
              // TODO 0.55 is hardcoded
              width={priceLevel.total * 0.55 + "%"}
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
