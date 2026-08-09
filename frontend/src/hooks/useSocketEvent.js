import { useEffect } from 'react';
import { getSocket } from '../services/socket';

function useSocketEvent(eventName, handler) {
  useEffect(() => {
    const socket = getSocket();
    socket.on(eventName, handler);
    return () => {
      socket.off(eventName, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName]);
}

export default useSocketEvent;
