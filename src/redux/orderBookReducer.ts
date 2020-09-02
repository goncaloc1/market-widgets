import { OrderBookActionType } from './orderBookActions'
import { AnyAction } from 'redux';
import { orderBy } from 'lodash';


export interface IOrderBookState {
  loading: boolean,
  nPricePoints: number,
  connected: boolean,
  bidsData: IPriceLevel[],
  asksData: IPriceLevel[]
}

export const getOrderBookInitialState = (): IOrderBookState => ({
  loading: true,
  nPricePoints: 0,
  connected: false,
  bidsData: [],
  asksData: []
});

export interface IPriceLevel {
  count: number,
  price: number,
  amount: number,
  total: number,
  priceFormatted: string,
  amountFormatted: string,
  totalFormatted: string
}


export const orderBookReducer = (state = getOrderBookInitialState(), action: AnyAction): IOrderBookState => {
  switch (action.type) {
    case OrderBookActionType.OrderBookInitStart: {
      const initial = getOrderBookInitialState();
      return { ...initial, nPricePoints: action.data }
    }
    case OrderBookActionType.OrderBookInitSuccess: {
      return { ...state };
    }
    /**
     * Note, didn't have time to optimize
     * OrderBookDataUpdate logic: performance and readability wise.
     * It's possible that it could get to simple O(n) time complexity.
     */
    case OrderBookActionType.OrderBookDataUpdate: {
      const { data } = action;

      if (data.event === "subscribed") {
        console.log("order book websocket subscribed");
        return { ...state, connected: true };
      }
      else if (Array.isArray(data)) {

        if (data[1].length === 3) {
          const o = data[1];
          if (o[1] === 0) {
            if (o[2] === 1) {
              // remove from bids
              const newData = state.bidsData.filter(pl => pl.price !== o[0]);
              const bidsData = updateTotals(newData);
              return { ...state, bidsData };
            }
            else {
              // remove from asks
              const newData = state.asksData.filter(pl => pl.price !== o[0]);
              const asksData = updateTotals(newData);
              return { ...state, asksData };
            }
          }
          else if (o[1] > 0) {
            // add or update price level
            if (o[2] > 0) {
              // add/update bids
              const bidsData = addOrUpdatePriceLevel(o, state.bidsData);
              return { ...state, bidsData };
            }
            else if (o[2] < 0) {
              // add/update asks
              const asksData = addOrUpdatePriceLevel(o, state.asksData);
              return { ...state, asksData };
            }
          }

          return { ...state };
        }
        else if (data[1].length === state.nPricePoints * 2) {
          // Snapshot
          const [bidsData, asksData] = initializePriceLevels(state.nPricePoints, data[1]);
          return { ...state, loading: false, bidsData, asksData };
        }
      }

      return state;
    }

    case OrderBookActionType.OrderBookDispose: {
      return { ...state, connected: false };
    }
    default:
      // TODO throw error
      return state;
  }
}


const formatTotal = (total: number) => total.toFixed(2);

/**
 * Given a price level, format
 * price, amount and total fields
 * and return a new instance.
 */
const doPriceLevelFormat = (pl: any): IPriceLevel => {
  return {
    ...pl,
    priceFormatted: pl.price.toLocaleString(undefined, { maximumFractionDigits: 3 }),
    amountFormatted: formatTotal(pl.amount),
    totalFormatted: formatTotal(pl.total)
  }
}


const initializePriceLevels = (nPricePoints: number, data: any[]) => {
  const bidsData: IPriceLevel[] = new Array(nPricePoints);
  const asksData: IPriceLevel[] = new Array(nPricePoints);

  data.forEach((o: number[], i: number) => {
    // TODO optimize
    if (i < nPricePoints) {
      bidsData[i] = doPriceLevelFormat({
        price: o[0],
        count: o[1],
        amount: o[2],
        total: i === 0 ? o[2] : bidsData[i - 1].total + o[2]
      });
    }
    else {
      const asksIdx = i - nPricePoints;
      asksData[asksIdx] = doPriceLevelFormat({
        price: o[0],
        count: o[1],
        amount: o[2],
        total: asksIdx === 0 ? o[2] : asksData[asksIdx - 1].total + o[2]
      });
    }
  });

  return [bidsData, asksData];
}

/**
 * Adds or updates a price level
 * in an existing list of price levels.
 */
const addOrUpdatePriceLevel = (o: number[], data: IPriceLevel[]) => {
  const found = data.find(pl => pl.price === o[0]);
  if (found) {
    return updatePriceLevel(found, o[2], data);
  }
  else {
    return addPriceLevel(o, data);
  }
}

/**
 * Updates price level data in array of price levels.
 * (updates amounts and totals).
 */
const updatePriceLevel = (priceLevel: IPriceLevel, amount: number, data: IPriceLevel[]) => {
  priceLevel.amount = amount;
  priceLevel.amountFormatted = formatTotal(amount);
  return updateTotals(data);
}

/**
 * Adds a new price level to array of price levels
 * and orders it (also updates amounts and totals).
 */
const addPriceLevel = (o: number[], data: IPriceLevel[]) => {
  const priceLevel = doPriceLevelFormat({
    price: o[0],
    count: o[1],
    amount: o[2],
    total: 0      // doesn't matter at this point, will be calculated after
  });

  let newData = [...data];
  newData.push(priceLevel);
  const orderedData = orderBy(newData, 'price', 'desc');
  return updateTotals(orderedData);
}

/**
 * Given an array of price levels,
 * iterate, update totals and return
 * a new array.
 */
const updateTotals = (data: IPriceLevel[]) => {
  const newData = [...data];
  let newPl: IPriceLevel;

  newData.forEach((pl, i) => {
    if (i > 0) {
      const total = newData[i - 1].total + pl.amount;
      newPl = { ...pl, total, totalFormatted: formatTotal(total) };
    }
    else {
      newPl = { ...pl, total: pl.amount, totalFormatted: formatTotal(pl.amount) };
    }
    newData[i] = newPl;
  });

  return newData;
}