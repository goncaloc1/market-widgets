import React from "react";

const ConnectionIssueButton: React.FC<{
  connected: boolean;
  triggerConnectionIssue: () => void;
}> = ({ connected, triggerConnectionIssue }) => {
  const simulateConnectionIssue = () => {
    if (connected) {
      triggerConnectionIssue();
    }
  };

  return (
    <div className="row float-right mr-n2">
      {connected ? (
        <button
          type="button"
          className="btn btn-link btn-sm"
          id="trades-connect-disconnect"
          onClick={simulateConnectionIssue}
        >
          Simulate Connection Issue
        </button>
      ) : (
        <small>Disconnected</small>
      )}
    </div>
  );
};

export { ConnectionIssueButton };
