import React from 'react';
import {Carousel} from 'components';
import styles from './index.module.scss';
import {MediaRenderProps} from '../RichCard/Media';
import {RichCard, Suggestion} from '../RichCard';
import {CommandUnion} from '../../props';

type Card = {
  id?: string;
  title?: string;
  description?: string;
  media: MediaRenderProps;
  suggestions: Suggestion[];
};

export type RichCardCarouselRenderProps = {
  cardWidth: string;
  cardContents: [Card];
  commandCallback?: (command: CommandUnion) => void;
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth} = props;

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
              cardWidth={cardWidth}
              commandCallback={props.commandCallback}
            />
          </div>
        );
      })}
    </Carousel>
  );
};
