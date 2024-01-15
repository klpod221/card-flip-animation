import EventEmitter from 'events';
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { DragContainer } from './DragContainer';
import { DragPayload, DragEvent } from '../../types/drag';

const DragContext = createContext<{
  dispatch: (event: DragEvent, payload: DragPayload) => void;
  listen: (event: DragEvent, callback: (payload: DragPayload) => void) => void;
  remove: (event: DragEvent, callback: (...args: any[]) => void) => void;
}>({
  dispatch: () => {},
  listen: () => {},
  remove: () => {},
});

export function DragProvider({ children }: PropsWithChildren) {
  const eventEmitter = useRef<EventEmitter>(new EventEmitter());

  const dispatch = useCallback((event: DragEvent, payload: DragPayload) => {
    eventEmitter.current.emit(event, payload);
  }, []);

  const listen = useCallback((event: DragEvent, callback: (payload: DragPayload) => void) => {
    eventEmitter.current.on(event, callback);
  }, []);

  const remove = useCallback((event: DragEvent, callback: (...args: any[]) => void) => {
    eventEmitter.current.removeListener(event, callback);
  }, []);

  const value = useMemo(
    () => ({
      dispatch,
      listen,
      remove,
    }),
    [dispatch, listen, remove],
  );

  return (
    <DragContext.Provider value={value}>
      <DragContainer>{children}</DragContainer>
    </DragContext.Provider>
  );
}

export const useDrag = () => useContext(DragContext);
