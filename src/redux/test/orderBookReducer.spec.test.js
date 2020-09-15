import { orderBookReducer, getOrderBookInitialState, doPriceLevelFormat, initializePriceLevels } from '../orderBookReducer';
import { OrderBookDataUpdate } from '../orderBookActions'


describe('orderBookReducer', () => {
  describe('OrderBookDataUpdate action type', () => {

    it('will consider state as connected when subscribed event is received.', () => {
      const state = getOrderBookInitialState();
      const actionData = { event: 'subscribed' };
      const action = OrderBookDataUpdate(actionData);

      const result = orderBookReducer(state, action);

      expect(result !== state).toBe(true);
      expect(result.connected).toBe(true);
    });

    it('will return a new state when initial snapshot data is passed.', () => {
      const state = getOrderBookInitialState();
      state.payload = { len: 2 };

      const actionData = ["", [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]];
      const action = OrderBookDataUpdate(actionData);
      const result = orderBookReducer(state, action);

      expect(result !== state).toBe(true);
      expect(result.loading).toBe(false);
      expect(result.bidsData.length).toBe(2);
      expect(result.asksData.length).toBe(2);
    });

    it('will return the same state if passed data is corrupt or unrecognized.', () => {
      const state = getOrderBookInitialState();
      const actionData = { unrecognizedData: true };
      const action = OrderBookDataUpdate(actionData);

      const result = orderBookReducer(state, action);

      expect(result === state).toBe(true);
    });

    it('will return the same state if payload length is not compatible with snapshot data length.', () => {
      const state = getOrderBookInitialState();
      state.payload = { len: 3 };

      const actionData = ["", [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]];
      const action = OrderBookDataUpdate(actionData);
      const result = orderBookReducer(state, action);

      expect(result === state).toBe(true);
    });

    // TODO cover remaining scenarios
  });
});


describe('doPriceLevelFormat', () => {
  it('returns a new price level object with formatted data.', () => {
    const data = {
      price: 10370,
      count: 5,
      amount: 8.59655336,
      total: 0
    };

    const result = doPriceLevelFormat(data);

    expect(result !== data).toBe(true);
    expect(result.price).toBe(data.price);
    expect(result.count).toBe(data.count);
    expect(result.amount).toBe(data.amount);
    expect(result.total).toBe(data.total);

    expect(result.priceFormatted).toBe("10,370");
    expect(result.amountFormatted).toBe("8.60");
    expect(result.totalFormatted).toBe("0.00");
  });
});


describe('initializePriceLevels', () => {
  it('returns bids and asks price levels from initial snapshot data.', () => {
    const nPricePoints = 25;
    const data = [
      [10403, 3, 0.16327], [10402, 8, 1.4412006], [10401, 3, 1.6448], [10400, 8, 2.22375874], [10399, 9, 8.8004628], [10398, 12, 5.0252096], [10397, 12, 3.5720368], [10396, 10, 3.9643572], [10395, 4, 0.0785724], [10394, 13, 5.71013748], [10393, 3, 3.14056824], [10392, 4, 0.0630048], [10391, 4, 3.39268098], [10390, 5, 2.2576048], [10389, 8, 0.24953165], [10388, 16, 10.20977799], [10387, 15, 4.73394877], [10386, 18, 7.50690476], [10385, 9, 0.8024144], [10384, 8, 3.43567652], [10383, 8, 2.6641072], [10382, 5, 9.90676406], [10381, 2, 2.27939763], [10380, 5, 2.3675], [10379, 7, 11.62867665],
      [10404, 1, -0.00842], [10405, 3, -0.9204], [10406, 2, -0.30110031], [10407, 6, -5.08673925], [10408, 8, -7.48644039], [10409, 4, -6.259771], [10410, 3, -3.68500001], [10411, 4, -2.00856599], [10412, 1, -0.79], [10413, 4, -2.60817877], [10414, 6, -4.73595], [10415, 4, -2.10637839], [10416, 6, -1.03011333], [10417, 5, -6.49568127], [10418, 5, -10.01602032], [10419, 2, -0.52900001], [10420, 6, -3.18162], [10421, 6, -8.04868575], [10422, 4, -8.87738042], [10423, 3, -3.85026918], [10424, 4, -1.66277], [10425, 6, -6.25446756], [10426, 7, -2.094984], [10427, 8, -6.23513251], [10428, 12, -4.85063781]
    ];

    const [bidsDataResult, asksDataResult] = initializePriceLevels(nPricePoints, data);

    expect(bidsDataResult.length).toBe(25);
    expect(asksDataResult.length).toBe(25);

    expect(bidsDataResult[0].price).toBe(data[0][0]);
    expect(bidsDataResult[0].count).toBe(data[0][1]);
    expect(bidsDataResult[0].amount).toBe(Math.abs(data[0][2]));
    expect(bidsDataResult[0].total).toBe(Math.abs(data[0][2]));

    expect(bidsDataResult[24].price).toBe(data[24][0]);
    expect(bidsDataResult[24].count).toBe(data[24][1]);
    expect(bidsDataResult[24].amount).toBe(Math.abs(data[24][2]));
    expect(bidsDataResult[24].total).toBe(97.26236407000003);           // summation of all amounts

    expect(asksDataResult[0].price).toBe(data[25][0]);
    expect(asksDataResult[0].count).toBe(data[25][1]);
    expect(asksDataResult[0].amount).toBe(Math.abs(data[25][2]));
    expect(asksDataResult[0].total).toBe(Math.abs(data[25][2]));

    expect(asksDataResult[24].price).toBe(data[49][0]);
    expect(asksDataResult[24].count).toBe(data[49][1]);
    expect(asksDataResult[24].amount).toBe(Math.abs(data[49][2]));
    expect(asksDataResult[24].total).toBe(99.12370626999997);           // summation of all amounts
  });
});

describe('updatePriceLevel', () => {
  //TODO
});

describe('addPriceLevel', () => {
  //TODO
});

describe('addOrUpdatePriceLevel', () => {
  //TODO
});

describe('updateTotals', () => {
  //TODO
});