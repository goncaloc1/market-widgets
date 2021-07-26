import orderBy from "lodash/orderBy";

export interface IPriceLevel {
  count: number;
  price: number;
  amount: number;
  total: number;
  priceFormatted: string;
  amountFormatted: string;
  totalFormatted: string;
}

const formatTotal = (total: number) => total.toFixed(2);

/**
 * Given a price level, format
 * price, amount and total fields
 * and return a new instance.
 */
export const doPriceLevelFormat = (pl: any): IPriceLevel => {
  return {
    ...pl,
    priceFormatted: pl.price.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    }),
    amountFormatted: formatTotal(pl.amount),
    totalFormatted: formatTotal(pl.total),
  };
};

export const initializePriceLevels = (nPricePoints: number, data: any[]) => {
  const bidsData: IPriceLevel[] = new Array(nPricePoints);
  const asksData: IPriceLevel[] = new Array(nPricePoints);

  data.forEach((o: number[], i: number) => {
    const amount = Math.abs(o[2]);
    // TODO optimize
    if (i < nPricePoints) {
      bidsData[i] = doPriceLevelFormat({
        price: o[0],
        count: o[1],
        amount,
        total: i === 0 ? amount : bidsData[i - 1].total + amount,
      });
    } else {
      const asksIdx = i - nPricePoints;
      asksData[asksIdx] = doPriceLevelFormat({
        price: o[0],
        count: o[1],
        amount,
        total: asksIdx === 0 ? amount : asksData[asksIdx - 1].total + amount,
      });
    }
  });

  return [bidsData, asksData] as const;
};

/**
 * Updates price level data in array of price levels.
 * (updates amounts and totals).
 */
const updatePriceLevel = (
  priceLevel: IPriceLevel,
  amount: number,
  data: IPriceLevel[]
) => {
  priceLevel.amount = amount;
  priceLevel.amountFormatted = formatTotal(amount);
  return updateTotals(data);
};

/**
 * Adds a new price level to array of price levels
 * and orders it (also updates amounts and totals).
 */
const addPriceLevel = (o: number[], data: IPriceLevel[], isBids: boolean) => {
  const priceLevel = doPriceLevelFormat({
    price: o[0],
    count: o[1],
    amount: Math.abs(o[2]),
    total: 0, // doesn't matter at this point, will be calculated after
  });

  let newData = [...data];
  newData.push(priceLevel);
  const orderedData = orderBy(newData, "price", isBids ? "desc" : "asc");
  return updateTotals(orderedData);
};

/**
 * Adds or updates a price level
 * in an existing list of price levels.
 */
export const addOrUpdatePriceLevel = (
  o: number[],
  data: IPriceLevel[],
  isBids: boolean
) => {
  const found = data.find((pl) => pl.price === o[0]);
  const amount = Math.abs(o[2]);
  if (found) {
    return updatePriceLevel(found, amount, data);
  } else {
    return addPriceLevel(o, data, isBids);
  }
};

/**
 * Given an array of price levels,
 * iterate, update totals and return
 * a new array.
 */
export const updateTotals = (data: IPriceLevel[]) => {
  const newData = [...data];
  let newPl: IPriceLevel;

  newData.forEach((pl, i) => {
    if (i > 0) {
      const total = newData[i - 1].total + pl.amount;
      newPl = { ...pl, total, totalFormatted: formatTotal(total) };
    } else {
      newPl = {
        ...pl,
        total: pl.amount,
        totalFormatted: formatTotal(pl.amount),
      };
    }
    newData[i] = newPl;
  });

  return newData;
};

export const getDecreasedPrecision = (currentPrecision: string): string => {
  const results = new Map();
  results.set("P0", "P0");
  results.set("P1", "P0");
  results.set("P2", "P1");
  results.set("P3", "P2");
  results.set("P4", "P3");

  return results.get(currentPrecision) || "P0";
};

export const getIncreasedPrecision = (currentPrecision: string): string => {
  const results = new Map();
  results.set("P0", "P1");
  results.set("P1", "P2");
  results.set("P2", "P3");
  results.set("P3", "P4");
  results.set("P4", "P4");

  return results.get(currentPrecision) || "P0";
};
