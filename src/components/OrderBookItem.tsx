import React from "react";

import { IPriceLevel } from "../redux/orderBookHelpers";

const OrderBookItem: React.FC<{ isBids: boolean; priceLevel: IPriceLevel }> = ({
  isBids,
  priceLevel,
}) => (
  <div className="row border-bottom" key={priceLevel.price}>
    {isBids ? (
      <>
        <div className="col-sm">{priceLevel.count}</div>
        <div className="col-sm">{priceLevel.amountFormatted}</div>
        <div className="col-sm text-right">{priceLevel.totalFormatted}</div>
        <div className="col-sm text-right">{priceLevel.priceFormatted}</div>
      </>
    ) : (
      <>
        <div className="col-sm">{priceLevel.priceFormatted}</div>
        <div className="col-sm">{priceLevel.totalFormatted}</div>
        <div className="col-sm text-right">{priceLevel.amountFormatted}</div>
        <div className="col-sm text-right">{priceLevel.count}</div>
      </>
    )}
  </div>
);

export { OrderBookItem };
