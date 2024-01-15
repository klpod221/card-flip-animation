import { FC } from 'react';
import { Card } from '../types/card';
import styles from './card.module.css';
import CARD_IMAGE_MAP from './cardImageMap';

import cover from '../assets/cards/card_back.png';
import clsx from 'clsx';

type CardProps = {
	card: Card;
	className?: string;
	isLong?: boolean;
	isThirdCard?: boolean;
};

const CardComponent: FC<CardProps> = ({ card, className, isLong, isThirdCard }) => {
	return (
		<div className={clsx(styles.flipCard, className, card.isSentToPlayer && styles.cardSent)}>
			<div
				className={`${styles.cardInner} ${
					!card.isFacingDown ? (isThirdCard ? styles.revealedCard2 : styles.revealed) : ''
				}`}
			>
				<div className={styles.cardFront}>
					<img className={isLong ? styles.longCard : styles.cardImage} src={cover} alt="" />
				</div>
				<div className={styles.cardBack}>
					<img
						className={isLong ? styles.longCard : styles.cardImage}
						src={CARD_IMAGE_MAP[`${card.name}${card.suit}`]}
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default CardComponent;
