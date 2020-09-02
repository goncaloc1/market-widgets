/**
 * Creates websocket and subscribes using payload.
 * Tries to reconnect unless close is called explicitly.
 */
export const createWebSocket = (payload: any, dataUpdateCallback: (data: any) => void) => {
  /**
   * Always try to WS resubscribe unless component is unmounting.
   */
  let resubscribeWS = true;
  let ws: WebSocket;

  const wsClose = () => ws && ws.close();

  const forceClose = () => {
    // normal component unmount, do not try to WS reconnect.
    resubscribeWS = false;
    wsClose();
  }

  const subscribeWS = () => {
    // TODO receive url as parameter
    ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    ws.onopen = () => {
      ws.send(JSON.stringify(payload));
    }

    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      dataUpdateCallback(data);
    }

    ws.onerror = (err: any) => {
      console.log("ws error:", err.message);
      wsClose();
    }

    ws.onclose = (e: any) => {
      console.log("ws close:", e.code, e.reason);
      resubscribeWS && subscribeWS();
    };
  }

  subscribeWS();

  return forceClose;
};