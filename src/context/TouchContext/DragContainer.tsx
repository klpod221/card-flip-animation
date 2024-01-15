import { PropsWithChildren, TouchEvent } from 'react';
import styles from './DragContainer.module.css';
import { useDrag } from './DragContext';
import { DragEvent } from '../../types/drag';

export function DragContainer({ children }: PropsWithChildren) {
  const { dispatch } = useDrag();

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    let touch = event.touches[0] || event.changedTouches[0];
    dispatch(DragEvent.dragStart, { event, x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    let touch = event.touches[0] || event.changedTouches[0];
    dispatch(DragEvent.dragEnd, { event, x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    let touch = event.touches[0] || event.changedTouches[0];
    dispatch(DragEvent.dragMove, { event, x: touch.clientX, y: touch.clientY });
  };

  return (
    <div className={styles.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}>
      {children}
    </div>
  );
}
