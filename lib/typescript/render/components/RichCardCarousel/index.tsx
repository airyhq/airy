import React from 'react';
import styles from './index.module.scss';
import {MediaRenderProps} from '../RichCard/Media';
import {DefaultMessageRenderingProps} from '../index';
import {RichCard, Suggestion} from '../RichCard';
import {Carousel} from '../Carousel';

type Card = {
  id?: string;
  title?: string;
  description?: string;
  media: MediaRenderProps;
  suggestions: Suggestion[];
};

export type RichCardCarouselRenderProps = DefaultMessageRenderingProps & {
  cardWidth: string;
  cardContents: [Card];
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth, fromContact} = props;

  return (
    <Carousel>
      {cardContents.map((card: Card, idx: number) => {
        return (
          <div key={idx} className={styles.richCard}>
            <RichCard
              title={card.title}
              description={card.description}
              media={card.media}
              suggestions={card.suggestions}
              fromContact={fromContact}
              cardWidth={cardWidth}
              commandCallback={props.commandCallback}
            />
          </div>
        );
      })}
    </Carousel>
  );
};
