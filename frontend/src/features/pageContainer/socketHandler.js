// import store from '../../app/store';
import socketIOClient from 'socket.io-client';
import ENV from '../../env';

export const socketInit = () => {
  let socketEndpoint, options;
  if (ENV.IS_DEVELOPMENT) {
    socketEndpoint = ENV.SOCKET_IO_ENDPOINT_DEV;
    options = {};
  } else {
    socketEndpoint = ENV.SOCKET_IO_ENDPOINT_PROD;
    options = {
      secure: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      },
    };
  }
  const socket = socketIOClient(socketEndpoint, options);
  socket.on('connect', () => {
    // store.dispatch(setConnStatus(ENV.CONN_STATUS_CONNECTED));
  });
  socket.on('disconnect', () => {
    // store.dispatch(setConnStatus(ENV.CONN_STATUS_NO_CONNECTION));
  });
  socket.on('reconnect', (attemptNumber) => {
    // store.dispatch(setConnStatus(ENV.CONN_STATUS_CONNECTED));
  });
  socket.on('reconnecting', (attemptNumber) => {
    // store.dispatch(setConnStatus(ENV.CONN_STATUS_CONNECTING));
  });
  socket.on('serverError', (data) => {
    console.error(`serverError: ${JSON.stringify(data)}`);
  });
  return socket;
};
