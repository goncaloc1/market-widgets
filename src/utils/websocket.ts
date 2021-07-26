/**
 * Creates websocket and subscribes using payload.
 * TODO reconnection
 */
export const createWebSocket = (
  payload: any,
  dataUpdateCallback: (data: any) => void
) => {
  /**
   * Always try to WS resubscribe unless component is unmounting.
   */
  let reconnection = true;
  let ws: WebSocket;

  const wsClose = () => ws && ws.close();

  /**
   * `reconnect` set to true could be useful to simulate connection issues
   */
  const close = (reconnect = false) => {
    if (!reconnect) {
      reconnection = false;
    }

    wsClose();
  };

  const subscribeWS = () => {
    // TODO receive url as parameter
    ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    ws.onopen = () => {
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      dataUpdateCallback(data);
    };

    ws.onerror = (err: any) => {
      console.log("ws error:", err.message);
      wsClose();
    };

    ws.onclose = (e: any) => {
      console.log("ws close:", e.code, e.reason);

      //TODO timeout / delay
      if (reconnection) {
        subscribeWS();
      }
    };
  };

  subscribeWS();

  return close;
};
