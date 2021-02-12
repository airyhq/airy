import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import {MediaRenderProps} from '../RichCard/Media';
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
  id?: string;
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

// Given width of RichCards
enum CardWidth {
  short = 136,
  medium = 280,
}

enum VisibleArea {
  short = 176,
  medium = 320,
}

export type RichCardCarouselRenderProps = DefaultMessageRenderingProps & {
  cardWidth: string;
  cardContents: [Card];
  id: string;
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth, id} = props;
  const [position, setPosition] = useState(0);
  const [disabled, setDiabled] = useState(false);
  const [style, setStyle] = useState('');
  const amountCards = cardContents.length;

  useEffect(() => {
    cardWidth == Width.short ? setStyle(styles.moveNextShort) : setStyle(styles.moveNext);
  }),
    [];

  const button = (position: number, amountCards: number, id: string) => {
    if (position == 0) {
      return (
        <button className={style} onClick={() => carouselMove(cardWidth, Direction.next, id)} disabled={disabled}>
          <img src={rightArrow} />
        </button>
      );
    }
    if (position == amountCards - 1) {
      return (
        <button
          className={styles.moveBack}
          onClick={() => carouselMove(cardWidth, Direction.back, id)}
          disabled={disabled}>
          <img src={leftArrow} />
        </button>
      );
    } else {
      return (
        <div>
          <button className={style} onClick={() => carouselMove(cardWidth, Direction.next, id)} disabled={disabled}>
            <img src={rightArrow} />
          </button>
          <button
            className={styles.moveBack}
            onClick={() => carouselMove(cardWidth, Direction.back, id)}
            disabled={disabled}>
            <img src={leftArrow} />
          </button>
        </div>
      );
    }
  };

  const carouselMove = (cardWidth: string, direction: Direction, id: string) => {
    setDiabled(true);
    setTimeout(function() {
      setDiabled(false);
    }, 600);
    direction == Direction.back ? setPosition(position - 1) : setPosition(position + 1);
    const elem = document.getElementById(id);
    const padding = 5;
    const space =
      cardWidth == Width.short ? VisibleArea.short - CardWidth.short : VisibleArea.medium - CardWidth.medium;
    const scrollDistance =
      cardWidth == Width.short ? VisibleArea.short - space + padding : VisibleArea.medium - space + padding;

    return elem.scrollBy({
      behavior: 'smooth',
      left: direction == Direction.back ? -scrollDistance : scrollDistance,
    });
  };

  return (
    <>
      <div className={styles.button}>{button(position, amountCards, id)}</div>
      <div
        id={id}
        className={styles.richCardCarouselContainer}
        // style={cardWidth === Width.short ? {width: '176px'} : {width: '320px'}}>
        style={cardWidth === Width.short ? {width: `${VisibleArea.short}px`} : {width: `${VisibleArea.medium}px`}}>
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
