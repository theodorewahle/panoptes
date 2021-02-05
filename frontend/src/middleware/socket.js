// import store from '../app/store';

export const socketMiddleware = (socket) => () => (next) => (action) => {
  if (socket == null) {
    return next(action);
  }
  if (action.type === 'video/somePlaceHolderAction') {
    const { event } = action.payload;
    socket.emit('somePlaceHolderAction', event);
  } else if (action.type === 'pageContainer/closeSocket' && socket.connected) {
    socket.close();
  } else if (action.type === 'lobby/openSocket' && !socket.connected) {
    socket.connect();
  }
  next(action);
};
