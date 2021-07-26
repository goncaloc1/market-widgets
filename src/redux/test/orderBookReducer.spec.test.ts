import {
  orderBookSlice,
  getOrderBookInitialState,
  IOrderBookState,
} from "../orderBookReducer";
import { orderBookDataUpdate } from "../orderBookActions";

describe("orderBookReducer", () => {
  const orderBookReducer = orderBookSlice.reducer;

  describe("orderBookDataUpdate action type", () => {
    it("will return a new state when initial snapshot data is passed.", () => {
      const state = getOrderBookInitialState();
      state.payload = { len: 2 } as IOrderBookState["payload"];

      const actionData = [
        "",
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      ];
      const action = orderBookDataUpdate(actionData);
      const result = orderBookReducer(state, action);

      expect(result !== state).toBe(true);
      expect(result.loading).toBe(false);
      expect(result.bidsData.length).toBe(2);
      expect(result.asksData.length).toBe(2);
    });

    it("will return the same state if passed data is corrupt or unrecognized.", () => {
      const state = getOrderBookInitialState();
      const actionData = { unrecognizedData: true };
      const action = orderBookDataUpdate(actionData);

      const result = orderBookReducer(state, action);

      // TODO review this, added an Immer comment in the reducer
      expect(result === state).toBe(false);
      expect(result).toEqual(state);
    });

    it("will return the same state if payload length is not compatible with snapshot data length.", () => {
      const state = getOrderBookInitialState();
      state.payload = { len: 3 } as IOrderBookState["payload"];

      const actionData = [
        "",
        [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ],
      ];
      const action = orderBookDataUpdate(actionData);
      const result = orderBookReducer(state, action);

      // TODO review this, added an Immer comment in the reducer
      expect(result === state).toBe(false);
      expect(result).toEqual(state);
    });

    // TODO cover remaining scenarios
  });
});
