/**
 * TODO make it a class
 */

/**
 * Creates websocket and subscribes using payload
 * Reconnection is enabled by default
 */
export const createWebSocket = (
  url: string,
  sendPayload: any,
  onDataUpdate: (data: any) => void,
  onConnectedChange?: (connected: boolean) => void
) => {
  const reconnectionDelay = 3000;
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

  /**
   * Returns true if connected
   */
  const handleConnectedChange = () => {
    const isConnected = ws.readyState === 1;

    console.log("onConnectedChange:", isConnected);

    if (onConnectedChange) {
      onConnectedChange(isConnected);
    }
  };

  const subscribeWS = () => {
    ws = new WebSocket(url);

    ws.onopen = () => {
      handleConnectedChange();
      ws.send(JSON.stringify(sendPayload));
    };

    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      onDataUpdate(data);
    };

    ws.onerror = (err: any) => {
      console.log("ws error:", err.message);
      handleConnectedChange();
      wsClose();
    };

    ws.onclose = (e: any) => {
      console.log("ws close:", e.code, e.reason);

      handleConnectedChange();

      if (reconnection) {
        setTimeout(subscribeWS, reconnectionDelay);
      }
    };
  };

  subscribeWS();

  return close;
};
