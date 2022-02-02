import React from "react";

import moment from "moment";
import { Trade } from "../redux/tradesReducer";

const TradeItem: React.FC<{ trade: Trade }> = ({ trade }) => {
  return (
    <div className="row border-bottom" key={trade[0]}>
      {trade[2] >= 0 && <div className="col-sm-1 text-success">&#8593;</div>}
      {trade[2] < 0 && <div className="col-sm-1 text-danger">&#8595;</div>}
      <div className="col-sm">{moment(trade[1]).format("hh:mm:ss")}</div>
      <div className="col-sm text-right">
        {trade[3].toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </div>
      <div className="col-sm text-right">{Math.abs(trade[2]).toFixed(4)}</div>
    </div>
  );
};

export { TradeItem };
