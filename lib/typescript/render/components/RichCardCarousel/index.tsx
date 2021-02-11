import React, {useState} from 'react';
import styles from './index.module.scss';
import {MediaRenderProps} from '../Media';
import {DefaultMessageRenderingProps} from '../index';
import {RichCard} from '../RichCard';
import leftArrow from 'assets/images/icons/leftArrow.svg';
import rightArrow from 'assets/images/icons/rightArrow.svg';
import {stat} from 'fs';

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
  short = 156,
  medium = 320,
}

export type RichCardCarouselRenderProps = DefaultMessageRenderingProps & {
  title?: string;
  cardWidth: string;
  cardContents: [Card];
  id: string;
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth, id} = props;
  const [position, setPosition] = useState(0);
  const [disabled, setDiabled] = useState(false);
  const amountCards = cardContents.length;

  const button = (position: number, amountCards: number, id: string) => {
    if (position == 0) {
      return (
        <button
          className={styles.moveNext}
          onClick={() => carouselMove(cardWidth, Direction.next, id)}
          disabled={disabled}>
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
          <button
            className={styles.moveNext}
            onClick={() => carouselMove(cardWidth, Direction.next, id)}
            disabled={disabled}>
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
    const scrollDistance = cardWidth == Width.short ? CardWidth.short + padding : CardWidth.medium + padding;

    console.log(scrollDistance);

    switch (cardWidth) {
      case Width.short:
        return elem.scrollBy({
          behavior: 'smooth',
        //   left: direction == Direction.back ? -VisibleArea.short : VisibleArea.short,
        });
      case Width.medium:
        return elem.scrollBy({
          behavior: 'smooth',
        //   left: direction == Direction.back ? -VisibleArea.medium : VisibleArea.medium,
        left: direction == Direction.back ? -scrollDistance : scrollDistance,
        });
    }
  };

  return (
    <>
      <div className={styles.button}>{button(position, amountCards, id)}</div>
      <div
        id={id}
        className={styles.richCardCarouselContainer}
        style={cardWidth === Width.short ? {width: '156px'} : {width: '320px'}}>
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
