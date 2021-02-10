import React, {useState} from 'react';
import styles from './index.module.scss';
import {MediaRenderProps} from '../Media';
import {DefaultMessageRenderingProps} from '../index';
import {RichCard} from '../RichCard';
import leftArrow from 'assets/images/icons/leftArrow.svg';
import rightArrow from 'assets/images/icons/rightArrow.svg';

type Suggestions = [
  {
    reply: {
      text: string;
      postbackData: string;
    };
  },
  {
    reply?: {
      text: string;
      postbackData: string;
    };
  }
];

type Card = {
  title?: string;
  description?: string;
  media: MediaRenderProps;
  suggestions: Suggestions;
};

enum Direction {
  back = 'back',
  next = 'next',
}

enum Width {
  short = 'SHORT',
  medium = 'MEDIUM',
}

export type RichCardCarouselRenderProps = DefaultMessageRenderingProps & {
  cardWidth: string;
  cardContents: [Card];
  id: string;
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth, id} = props;
  const [position, setPosition] = useState(0);
  const amountCards = cardContents.length;

  const button = (position: number, amountCards: number, id: string) => {
    if (position == 0) {
      return (
        <button className={styles.moveNext} onClick={() => carouselMove(cardWidth, Direction.next, id)}>
          <img src={rightArrow} />
        </button>
      );
    }
    if (position == amountCards - 1) {
      return (
        <button className={styles.moveBack} onClick={() => carouselMove(cardWidth, Direction.back, id)}>
          <img src={leftArrow} />
        </button>
      );
    } else {
      return (
        <div>
          <button className={styles.moveNext} onClick={() => carouselMove(cardWidth, Direction.next, id)}>
            <img src={rightArrow} />
          </button>
          <button className={styles.moveBack} onClick={() => carouselMove(cardWidth, Direction.back, id)}>
            <img src={leftArrow} />
          </button>
        </div>
      );
    }
  };

  const carouselMove = (cardWidth: string, direction: Direction, id: string) => {
    direction == Direction.back ? setPosition(position - 1) : setPosition(position + 1);
    const elem = document.getElementById(id);


    switch (cardWidth) {
      case Width.short:
        return elem.scrollBy({
          behavior: 'smooth',
          left: direction == Direction.back ? -136 : 136,
        });
      case Width.medium:
        return elem.scrollBy({
          behavior: 'smooth',
          left: direction == Direction.back ? -293 : 293,
        });
    }
  };

  return (
    <>
      <div className={styles.button}>{button(position, amountCards, id)}</div>
      <div
        id={id}
        className={styles.richCardCarouselContainer}
        style={cardWidth === Width.short ? {width: '280px'} : {width: '320px'}}>
        {cardContents.map((card: Card) => {
          return (
            <div key={card.title} className={styles.richCard}>
              <RichCard
                title={card.title}
                description={card.description}
                media={card.media}
                suggestions={card.suggestions}
                fromContact={true}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
