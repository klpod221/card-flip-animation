import { TouchEvent } from 'react';

export interface DragPayload {
  event?: TouchEvent;
  x: number;
  y: number;
}

export enum DragEvent {
  dragStart = 'dragStart',
  dragMove = 'dragMove',
  dragEnd = 'dragEnd',
}
