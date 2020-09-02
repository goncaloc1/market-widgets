import React from 'react';

function Loading(props: { loading: boolean }) {
  return (
    <>
      {props.loading &&
        <div className="loading-spinner d-flex justify-content-center">
          <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
    </>
  );
}


export default Loading;