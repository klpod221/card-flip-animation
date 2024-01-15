import CARD_IMAGE_MAP from "../Card/cardImageMap";
import { Card, CardEdge } from "../types/card";
import {
  MouseEvent,
  TouchEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cover from "../assets/cards/card_back.png";

import styles from "./sneakCard.module.css";
import CardComponent from "../Card";
import clsx from "clsx";
import { useDrag } from "../context/TouchContext/DragContext";
import { DragEvent, DragPayload } from "../types/drag";

type SneakCardProps = {
  card: Card;
  className?: string;
  onCardRevealed: () => void;
  onCardRevealing: (
    origin?: CardEdge,
    x?: number,
    y?: number,
    destination?: CardEdge
  ) => void;
};
// https://bennettfeely.com/clippy/
// https://cssgradient.io/
const SneakCard = forwardRef<HTMLDivElement, SneakCardProps>(
  ({ card, className, onCardRevealed, onCardRevealing }, ref) => {
    const [touchOrigin, setTouchOrigin] = useState<CardEdge>();
    const isRevealedRef = useRef(false);
    const isTouchStarted = useRef(false);
    const isDragStartedFromOutside = useRef(false);
    const isTouchEntered = useRef(false);
    const [isTriggeredFromOutside, setTriggeredFromOutside] = useState(false);
    const [revealCard, setRevealCard] = useState(false);
    const [centerOffset, setCenterOffset] = useState(0);

    const cardContainer = useRef<HTMLDivElement>(null);
    const cardBackClip = useRef<HTMLDivElement>(null);
    const cardBackImg = useRef<HTMLImageElement>(null);
    const backShadow = useRef<HTMLImageElement>(null);

    const topContainer = useRef<HTMLDivElement>(null);
    const topImage = useRef<HTMLImageElement>(null);
    const topShadow = useRef<HTMLDivElement>(null);

    const leftContainer = useRef<HTMLDivElement>(null);
    const leftImage = useRef<HTMLImageElement>(null);
    const leftShadow = useRef<HTMLDivElement>(null);

    const rightContainer = useRef<HTMLDivElement>(null);
    const rightImage = useRef<HTMLImageElement>(null);
    const rightShadow = useRef<HTMLDivElement>(null);

    const bottomContainer = useRef<HTMLDivElement>(null);
    const bottomImage = useRef<HTMLImageElement>(null);
    const bottomShadow = useRef<HTMLDivElement>(null);

    const frontContainer = useMemo(() => {
      switch (touchOrigin) {
        case CardEdge.TOP:
          return topContainer;
        case CardEdge.LEFT:
          return leftContainer;
        case CardEdge.RIGHT:
          return rightContainer;
        case CardEdge.BOTTOM:
          return bottomContainer;

        default:
          return undefined;
      }
    }, [touchOrigin]);

    const frontImage = useMemo(() => {
      switch (touchOrigin) {
        case CardEdge.TOP:
          return topImage;
        case CardEdge.LEFT:
          return leftImage;
        case CardEdge.RIGHT:
          return rightImage;
        case CardEdge.BOTTOM:
          return bottomImage;

        default:
          return undefined;
      }
    }, [touchOrigin]);

    const shadow = useMemo(() => {
      switch (touchOrigin) {
        case CardEdge.TOP:
          return topShadow;
        case CardEdge.LEFT:
          return leftShadow;
        case CardEdge.RIGHT:
          return rightShadow;
        case CardEdge.BOTTOM:
          return bottomShadow;
        default:
          return undefined;
      }
    }, [touchOrigin]);

    const assignTouchOrigin = useCallback((x: number, y: number) => {
      const toTop = y;
      const toBottom = 320 - y;
      const toLeft = x;
      const toRight = 250 - x;

      const sorted = [toTop, toBottom, toLeft, toRight].sort((a, b) => a - b);

      switch (sorted[0]) {
        case toTop:
          setTouchOrigin(CardEdge.TOP);
          setCenterOffset(x - 125);
          break;
        case toBottom:
          setTouchOrigin(CardEdge.BOTTOM);
          setCenterOffset(x - 125);
          break;
        case toLeft:
          setTouchOrigin(CardEdge.LEFT);
          setCenterOffset(y - 160);
          break;
        case toRight:
          setTouchOrigin(CardEdge.RIGHT);
          setCenterOffset(y - 160);
          break;
      }
    }, []);

    const resetCard = useCallback(() => {
      onCardRevealing();
      if (isRevealedRef.current) return;
      if (cardBackClip.current) {
        cardBackClip.current.style.clipPath = "unset";
      }
      if (cardContainer?.current) {
        cardContainer.current.style.overflow = "hidden";
      }
      if (backShadow.current) {
        backShadow.current.style.background = "unset";
        backShadow.current.style.transform = "none";
      }
      [topContainer, leftContainer, rightContainer, bottomContainer].forEach(
        (container) => {
          if (container?.current) {
            container.current.style.transform = "unset";
            container.current.style.clipPath = "unset";
            container.current.style.display = "none";
          }
        }
      );
      setTouchOrigin(undefined);
    }, [onCardRevealing]);

    const sendTouchEvent = useCallback(
      (x: number, y: number) => {
        if (touchOrigin === undefined || x > 250 || y > 320 || x < 0 || y < 0) {
          return;
        }

        switch (touchOrigin) {
          case CardEdge.TOP: {
            // trigger reveal to the right
            if (centerOffset < 0 && x > 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.RIGHT);
              return;
            }

            // trigger reveal to the left
            if (centerOffset > 0 && x < 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.LEFT);
              return;
            }

            // trigger reveal to the bottom
            if (y > 160) {
              onCardRevealing(touchOrigin, x, y, CardEdge.BOTTOM);
              return;
            }
            break;
          }

          case CardEdge.LEFT: {
            // trigger reveal to the right
            if (x > 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.RIGHT);
              return;
            }
            break;
          }

          case CardEdge.RIGHT: {
            // trigger reveal to the left
            if (x < 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.LEFT);
              return;
            }
            break;
          }

          case CardEdge.BOTTOM: {
            // trigger reveal to the right
            if (centerOffset < 0 && x > 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.RIGHT);
              return;
            }

            // trigger reveal to the left
            if (centerOffset > 0 && x < 125) {
              onCardRevealing(touchOrigin, x, y, CardEdge.LEFT);
              return;
            }

            // trigger reveal to the top
            if (y < 160) {
              onCardRevealing(touchOrigin, x, y, CardEdge.TOP);
              return;
            }
            break;
          }
          default:
            break;
        }
        onCardRevealing(touchOrigin, x, y);
      },
      [onCardRevealing, touchOrigin, centerOffset]
    );

    const prepareForFinalTransition = useCallback(() => {
      if (
        cardContainer.current &&
        frontContainer?.current &&
        cardBackImg?.current &&
        cardBackClip?.current &&
        frontImage?.current &&
        backShadow?.current &&
        shadow?.current
      ) {
        isRevealedRef.current = true;
        frontContainer.current.style.transition = "transform 0.5s";
        frontImage.current.style.transition = "clip-path 0.5s";
        cardBackImg.current.style.transition = "transform 0.5s";
        shadow.current.style.transition = "clip-path 0.5s";
        shadow.current.style.background = "transparent";
        backShadow.current.style.background = "transparent";
      }
    }, [
      cardContainer,
      cardBackClip,
      cardBackImg,
      frontContainer,
      frontImage,
      backShadow,
      shadow,
    ]);

    const renderCard = useCallback(
      (x: number, y: number) => {
        if (x > 250 || y > 320 || x < 0 || y < 0) {
          resetCard();
          return;
        }

        if (touchOrigin) {
          sendTouchEvent(x, y);
        } else {
          assignTouchOrigin(x, y);
          return;
        }

        if (
          cardContainer.current &&
          frontContainer?.current &&
          cardBackImg?.current &&
          cardBackClip?.current &&
          frontImage?.current &&
          shadow?.current &&
          backShadow?.current
        ) {
          frontContainer.current.style.display = "initial";
          cardContainer.current.style.overflow = "visible";

          const doubleOffset = Math.abs(centerOffset) * 2;

          switch (touchOrigin) {
            case CardEdge.TOP: {
              // trigger reveal to the right
              if (centerOffset < 0 && x > 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform = `translate(${doubleOffset}px, 0) rotate(-180deg)`;
                cardBackImg.current.style.transform = "translate(-250px, 0)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 640px, 0px 320px)";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 640px, 0px 320px)";
                onCardRevealed();
                return;
              }

              // trigger reveal to the left
              if (centerOffset > 0 && x < 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform = `translate(-${doubleOffset}px, 0) rotate(180deg)`;
                cardBackImg.current.style.transform = "translate(250px, 0)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 320px, 0px 640px)";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 320px, 0px 640px)";
                onCardRevealed();
                return;
              }

              // trigger reveal to the bottom
              if (y > 160) {
                prepareForFinalTransition();
                frontContainer.current.style.transform =
                  "translate(0, 320px) rotate(0deg)";
                cardBackImg.current.style.transform = "translate(0, -320px)";
                frontImage.current.style.clipPath =
                  "polygon(100% 0, -250px 0, 100% 640px)";
                shadow.current.style.clipPath =
                  "polygon(100% 0, -250px 0, 100% 640px)";
                onCardRevealed();
                return;
              }

              const touchPointToSamePointOnTop = Math.sqrt(
                (x - 125 - centerOffset) * (x - 125 - centerOffset) + y * y
              );
              const cosin = y / touchPointToSamePointOnTop;
              const angle = Math.acos(cosin) * (180 / Math.PI);
              const cardRotateAngle = (180 - angle) * 2;
              if (cardRotateAngle < 325) {
                resetCard();
                return;
              }

              const middleToRightEdge =
                125 + centerOffset + (x - 125 - centerOffset) / 2;
              const middleToLeftEdge = 250 - middleToRightEdge;
              const middleToTopEdge = y / 2;

              frontContainer.current.style.transformOrigin = `${
                125 + centerOffset
              }px 320px`;

              backShadow.current.style.transform = "rotate(180deg)";

              if (x > 125 + centerOffset) {
                const flippedRightCorner =
                  middleToTopEdge +
                  Math.tan(angle * (Math.PI / 180)) * middleToRightEdge;

                const flippedLeftCorner =
                  middleToTopEdge -
                  middleToLeftEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedRightCorner;

                frontContainer.current.style.transform = `translate(${
                  x - 125 - centerOffset
                }px, ${y}px) rotate(${cardRotateAngle - 360}deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 ${flippedRightCorner}px, 100% ${flippedLeftCorner}px, 100% 100%, 0 100%)`;

                frontImage.current.style.clipPath = `polygon(100% 0, 100% 0, 100% ${flippedRightCorner}px, 0 ${flippedLeftCorner}px)`;

                shadow.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 0 100%, 0% 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (360 - cardRotateAngle) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 360) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              } else {
                const flippedRightCorner =
                  middleToTopEdge -
                  Math.tan(angle * (Math.PI / 180)) * middleToRightEdge;

                const flippedLeftCorner =
                  middleToTopEdge +
                  middleToLeftEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedLeftCorner;

                frontContainer.current.style.transform = `translate(${
                  x - 125 - centerOffset
                }px, ${y}px) rotate(${360 - cardRotateAngle}deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 ${flippedRightCorner}px, 100% ${flippedLeftCorner}px, 100% 100%, 0 100%)`;

                frontImage.current.style.clipPath = `polygon(0 0, 100% 0, 100% ${flippedRightCorner}px, 0 ${flippedLeftCorner}px)`;

                shadow.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 100% 100%, 0% 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 360) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (360 - cardRotateAngle) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              }
              break;
            }

            case CardEdge.LEFT: {
              const touchPointToSamePointOnLeft = Math.sqrt(
                x * x + (y - 160 - centerOffset) * (y - 160 - centerOffset)
              );
              const cosin = x / touchPointToSamePointOnLeft;
              const angle = Math.acos(cosin) * (180 / Math.PI);
              const cardRotateAngle = (180 - angle) * 2;
              // if (cardRotateAngle < 325) {
              //   resetCard();
              //   return;
              // }

              const middleToTopEdge =
                160 + centerOffset + (y - 160 - centerOffset) / 2;
              const middleToBottomEdge = 320 - middleToTopEdge;
              const middleToLeftEdge = x / 2;

              frontContainer.current.style.transformOrigin = `right ${
                160 + centerOffset
              }px`;

              // trigger reveal to the right
              if (x > 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform =
                  "translate(250px, 0px) rotate(0deg)";
                cardBackImg.current.style.transform = "translate(-250px, 0px)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)";
                onCardRevealed();
                return;
              }

              if (y > 160 + centerOffset) {
                const flippedTopCorner =
                  middleToLeftEdge +
                  Math.tan(angle * (Math.PI / 180)) * middleToTopEdge;

                const flippedBottomCorner =
                  middleToLeftEdge -
                  middleToBottomEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedTopCorner;

                frontContainer.current.style.transform = `translate(${x}px, ${
                  y - 160 - centerOffset
                }px) rotate(${360 - cardRotateAngle}deg)`;

                cardBackClip.current.style.clipPath = `polygon(${flippedTopCorner}px 0, 100% 0, 100% 100%, ${flippedBottomCorner}px 100%)`;

                frontImage.current.style.clipPath = `polygon(${
                  250 - flippedTopCorner
                }px 0, 100% 0, 100% 100%, ${250 - flippedBottomCorner}px 100%)`;

                shadow.current.style.clipPath = `polygon(${
                  250 - flippedTopCorner
                }px 0, 100% 0, 100% 100%, ${250 - flippedBottomCorner}px 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (180 + cardRotateAngle) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (-cardRotateAngle - 180) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              } else {
                const flippedTopCorner =
                  middleToLeftEdge -
                  Math.tan(angle * (Math.PI / 180)) * middleToTopEdge;

                const flippedBottomCorner =
                  middleToLeftEdge +
                  middleToBottomEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedBottomCorner;

                frontContainer.current.style.transform = `translate(${x}px, ${
                  y - 160 - centerOffset
                }px) rotate(${cardRotateAngle - 360}deg)`;

                cardBackClip.current.style.clipPath = `polygon(${flippedTopCorner}px 0, 100% 0, 100% 100%, ${flippedBottomCorner}px 100%)`;

                frontImage.current.style.clipPath = `polygon(${
                  250 - flippedTopCorner
                }px 0, 100% 0, 100% 100%, ${250 - flippedBottomCorner}px 100%)`;

                shadow.current.style.clipPath = `polygon(${
                  250 - flippedTopCorner
                }px 0, 100% 0, 100% 100%, ${250 - flippedBottomCorner}px 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (-cardRotateAngle + 180) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 180) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              }

              break;
            }

            case CardEdge.RIGHT: {
              const touchPointToSamePointOnRight = Math.sqrt(
                (250 - x) * (250 - x) +
                  (y - 160 - centerOffset) * (y - 160 - centerOffset)
              );
              const cosin = (250 - x) / touchPointToSamePointOnRight;
              const angle = Math.acos(cosin) * (180 / Math.PI);
              const cardRotateAngle = (180 - angle) * 2;
              // if (cardRotateAngle < 325) {
              //   resetCard();
              //   return;
              // }

              const middleToTopEdge =
                160 + centerOffset + (y - 160 - centerOffset) / 2;
              const middleToBottomEdge = 320 - middleToTopEdge;
              const middleToRightEdge = (250 - x) / 2;

              frontContainer.current.style.transformOrigin = `left ${
                160 + centerOffset
              }px`;

              backShadow.current.style.transform = "rotate(180deg)";

              // trigger reveal to the left
              if (x < 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform =
                  "translate(-250px, 0px) rotate(0deg)";
                cardBackImg.current.style.transform = "translate(250px, 0px)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%";
                onCardRevealed();
                return;
              }

              if (y > 160 + centerOffset) {
                const flippedBottomCorner =
                  middleToRightEdge -
                  Math.tan(angle * (Math.PI / 180)) * middleToBottomEdge;

                const flippedTopCorner =
                  middleToRightEdge +
                  middleToTopEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedTopCorner;

                frontContainer.current.style.transform = `translate(-${
                  250 - x
                }px, ${y - 160 - centerOffset}px) rotate(${
                  cardRotateAngle - 360
                }deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 0, ${
                  250 - flippedTopCorner
                }px 0, ${250 - flippedBottomCorner}px 100%, 0% 100%)`;

                frontImage.current.style.clipPath = `polygon(0 0, ${flippedTopCorner}px 0, ${flippedBottomCorner}px 100%, 0 100%)`;

                shadow.current.style.clipPath = `polygon(0 0, ${flippedTopCorner}px 0, ${flippedBottomCorner}px 100%, 0 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (-cardRotateAngle - 180) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 180) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              } else {
                const flippedBottomCorner =
                  middleToRightEdge +
                  Math.tan(angle * (Math.PI / 180)) * middleToBottomEdge;

                const flippedTopCorner =
                  middleToRightEdge -
                  middleToTopEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedBottomCorner;

                frontContainer.current.style.transform = `translate(-${
                  250 - x
                }px, ${y - 160 - centerOffset}px) rotate(${
                  360 - cardRotateAngle
                }deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 0, ${
                  250 - flippedTopCorner
                }px 0, ${250 - flippedBottomCorner}px 100%, 0% 100%)`;

                frontImage.current.style.clipPath = `polygon(0 0, ${flippedTopCorner}px 0, ${flippedBottomCorner}px 100%, 0 100%)`;

                shadow.current.style.clipPath = `polygon(0 0, ${flippedTopCorner}px 0, ${flippedBottomCorner}px 100%, 0 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 180) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint * 0.9
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (-cardRotateAngle - 180) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              }

              break;
            }

            case CardEdge.BOTTOM: {
              const touchPointToSamePointOnBottom = Math.sqrt(
                (320 - y) * (320 - y) +
                  (x - 125 - centerOffset) * (x - 125 - centerOffset)
              );

              const cosin = (320 - y) / touchPointToSamePointOnBottom;
              const angle = Math.acos(cosin) * (180 / Math.PI);
              const cardRotateAngle = (180 - angle) * 2;
              // if (cardRotateAngle < 325) {
              //   resetCard();
              //   return;
              // }

              const middleToLeftEdge =
                125 + centerOffset + (x - 125 - centerOffset) / 2;
              const middleToRightEdge = 250 - middleToLeftEdge;
              const middleToBottomEdge = (320 - y) / 2;

              frontContainer.current.style.transformOrigin = `${
                125 + centerOffset
              }px 0`;

              // trigger reveal to the right
              if (centerOffset < 0 && x > 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform = `translate(${doubleOffset}px, 0) rotate(180deg)`;
                cardBackImg.current.style.transform = "translate(-250px, 0)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% -160px, 100% 100%, 0% 100%)";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% -160px, 100% 100%, 0% 100%)";
                onCardRevealed();
                return;
              }

              // trigger reveal to the left
              if (centerOffset > 0 && x < 125) {
                prepareForFinalTransition();
                frontContainer.current.style.transform = `translate(${-doubleOffset}px, 0) rotate(-180deg)`;
                cardBackImg.current.style.transform = "translate(250px, 0)";
                frontImage.current.style.clipPath =
                  "polygon(0px -125px, 100% 0px, 100% 100%, 0% 100%)";
                shadow.current.style.clipPath =
                  "polygon(0px -125px, 100% 0px, 100% 100%, 0% 100%)";
                onCardRevealed();
                return;
              }

              // trigger reveal to the top
              if (y < 160) {
                prepareForFinalTransition();
                frontContainer.current.style.transform =
                  "translate(0, -320px) rotate(0deg)";
                cardBackImg.current.style.transform = "translate(0, 320px)";
                frontImage.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%)";
                shadow.current.style.clipPath =
                  "polygon(0px 0px, 100% 0px, 100% 100%, 0% 100%)";
                onCardRevealed();
                return;
              }

              if (x > 125 + centerOffset) {
                const flippedLeftCorner =
                  middleToBottomEdge +
                  Math.tan(angle * (Math.PI / 180)) * middleToLeftEdge;

                const flippedRightCorner =
                  middleToBottomEdge -
                  middleToRightEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedLeftCorner;

                frontContainer.current.style.transform = `translate(${
                  x - 125 - centerOffset
                }px, -${320 - y}px) rotate(${360 - cardRotateAngle}deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 0, 100% 0, 100% ${
                  320 - flippedRightCorner
                }px, 0 ${320 - flippedLeftCorner}px)`;

                frontImage.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 100% 100%, 0% 100%)`;

                shadow.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 100% 100%, 0% 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 360) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint / 1.1
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (360 - cardRotateAngle) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              } else {
                const flippedLeftCorner =
                  middleToBottomEdge -
                  Math.tan(angle * (Math.PI / 180)) * middleToLeftEdge;

                const flippedRightCorner =
                  middleToBottomEdge +
                  middleToRightEdge / Math.tan((90 - angle) * (Math.PI / 180));

                const farestPoint = cosin * flippedRightCorner;

                frontContainer.current.style.transform = `translate(${
                  x - 125 - centerOffset
                }px, -${320 - y}px) rotate(${cardRotateAngle - 360}deg)`;

                cardBackClip.current.style.clipPath = `polygon(0 0, 100% 0, 100% ${
                  320 - flippedRightCorner
                }px, 0 ${320 - flippedLeftCorner}px)`;

                frontImage.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 100% 100%, 0% 100%)`;

                shadow.current.style.clipPath = `polygon(0 ${
                  320 - flippedRightCorner
                }px, 100% ${320 - flippedLeftCorner}px, 100% 100%, 0% 100%)`;

                shadow.current.style.background = `linear-gradient(${
                  (360 - cardRotateAngle) / 2
                }deg, rgba(255, 255, 255, 0) ${
                  farestPoint / 1.1
                }px, rgba(0, 0, 0, 0.57) ${farestPoint}px)`;

                backShadow.current.style.background = `linear-gradient(${
                  (cardRotateAngle - 360) / 2
                }deg, rgba(0, 0, 0, 0.2) ${
                  farestPoint * 1.1
                }px, rgba(255, 255, 255, 0) ${farestPoint * 1.3}px)`;
              }

              break;
            }
            default:
              return undefined;
          }
        }
      },
      [
        touchOrigin,
        frontContainer,
        frontImage,
        shadow,
        resetCard,
        sendTouchEvent,
        centerOffset,
        prepareForFinalTransition,
        onCardRevealed,
        assignTouchOrigin,
      ]
    );

    const onMouseMove = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (isRevealedRef.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        renderCard(x, y);
      },
      [renderCard]
    );

    const onTouchMove = useCallback(
      (event: TouchEvent<HTMLDivElement>) => {
        if (isRevealedRef.current || isDragStartedFromOutside.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.touches[0].clientX - bounds.left;
        const y = event.touches[0].clientY - bounds.top;

        renderCard(x, y);
      },
      [renderCard]
    );

    const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
      if (isRevealedRef.current) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      assignTouchOrigin(x, y);
    };

    const onTouchStart = useCallback(
      (event: TouchEvent<HTMLDivElement>) => {
        if (isRevealedRef.current) return;

        console.log("onTouchStart");

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.touches[0].clientX - bounds.left;
        const y = event.touches[0].clientY - bounds.top;

        assignTouchOrigin(x, y);

        isTouchStarted.current = true;
      },
      [assignTouchOrigin]
    );

    const onTouchEnter = useCallback(
      (x: number, y: number) => {
        if (isRevealedRef.current) return;

        console.log("onTouchEnter");
        assignTouchOrigin(x, y);
      },
      [assignTouchOrigin]
    );

    const onTouchMoveFromOutside = useCallback(
      (x: number, y: number) => {
        if (isRevealedRef.current) return;

        console.log("onTouchMoveFromOutside");
        renderCard(x, y);
      },
      [renderCard]
    );

    useEffect(() => {
      if (card.isFacingDown === false && isRevealedRef.current === false) {
        setTriggeredFromOutside(true);
        setTimeout(() => {
          setRevealCard(true);
        }, 50);
      }
    }, [card.isFacingDown]);

    const { listen, remove } = useDrag();
    useEffect(() => {
      const onDragStart = ({ x, y }: DragPayload) => {
        if (cardContainer.current) {
          const { top, left, right, bottom } =
            cardContainer.current.getBoundingClientRect();
          console.log("drag", x, y);
          console.log("bound", left, right, top, bottom);
          if (x < left || x > right || y < top || y > bottom) {
            isDragStartedFromOutside.current = true;
          }
        }
      };
      const onDragMove = ({ x, y }: DragPayload) => {
        if (cardContainer.current) {
          const { top, left, right, bottom } =
            cardContainer.current.getBoundingClientRect();
          if (
            isDragStartedFromOutside.current &&
            x >= left &&
            x <= right &&
            y >= top &&
            y <= bottom
          ) {
            if (!isTouchEntered.current) {
              onTouchEnter(x - left, y - top);
              isTouchEntered.current = true;
            } else {
              onTouchMoveFromOutside(x - left, y - top);
            }
          }
        }
      };
      const onDragEnd = () => {
        isDragStartedFromOutside.current = false;
        isTouchEntered.current = false;
        resetCard();
      };

      listen(DragEvent.dragStart, onDragStart);
      listen(DragEvent.dragMove, onDragMove);
      listen(DragEvent.dragEnd, onDragEnd);

      return () => {
        remove(DragEvent.dragStart, onDragStart);
        remove(DragEvent.dragMove, onDragMove);
        remove(DragEvent.dragEnd, onDragEnd);
      };
    }, [
      assignTouchOrigin,
      listen,
      onTouchEnter,
      onTouchMove,
      onTouchMoveFromOutside,
      onTouchStart,
      remove,
      resetCard,
    ]);

    if (isTriggeredFromOutside && !isRevealedRef.current) {
      return (
        <CardComponent
          card={{ ...card, isFacingDown: !revealCard }}
          className={className}
        />
      );
    }

    return (
      <div
        className={clsx(
          styles.flipCard,
          className,
          card.isSentToPlayer && styles.cardSent
        )}
        ref={cardContainer}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseLeave={() => {
          resetCard();
        }}
        onTouchEnd={() => {
          isTouchStarted.current = false;
          resetCard();
        }}
      >
        <div
          ref={cardBackClip}
          style={{ overflow: "hidden", width: "250px", height: "320px" }}
        >
          <img className={styles.back} src={cover} alt="" ref={cardBackImg} />
          <div ref={backShadow} className={styles.shadow} />
        </div>
        <div ref={topContainer} className={styles.topContainer}>
          <img
            ref={topImage}
            className={styles.front}
            src={CARD_IMAGE_MAP[`${card.name}${card.suit}`]}
            alt=""
          />
          <div ref={topShadow} className={styles.shadow} />
        </div>

        <div ref={leftContainer} className={styles.leftContainer}>
          <img
            ref={leftImage}
            className={styles.front}
            src={CARD_IMAGE_MAP[`${card.name}${card.suit}`]}
            alt=""
          />
          <div ref={leftShadow} className={styles.shadow} />
        </div>

        <div ref={rightContainer} className={styles.rightContainer}>
          <img
            ref={rightImage}
            className={styles.front}
            src={CARD_IMAGE_MAP[`${card.name}${card.suit}`]}
            alt=""
          />
          <div ref={rightShadow} className={styles.shadow} />
        </div>

        <div ref={bottomContainer} className={styles.bottomContainer}>
          <img
            ref={bottomImage}
            className={styles.front}
            src={CARD_IMAGE_MAP[`${card.name}${card.suit}`]}
            alt=""
          />
          <div ref={bottomShadow} className={styles.shadow} />
        </div>
      </div>
    );
  }
);

export default SneakCard;
