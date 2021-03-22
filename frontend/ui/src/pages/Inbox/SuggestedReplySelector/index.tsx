import React, {useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {SourceMessage} from 'render';
import styles from './index.module.scss';
import {listTemplates} from '../../../actions/templates';
import {SuggestedReply} from 'httpclient';
import {StateModel} from '../../../reducers';
import ListenOutsideClick from '../../../components/ListenOutsideClick';
import {Carousel} from 'render/components/Carousel';

const mapDispatchToProps = {
  listTemplates,
};

const mapStateToProps = (state: StateModel) => {
  return {
    templates: state.data.templates.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  onClose: () => void;
  suggestions: {
    [suggestionId: string]: SuggestedReply;
  };
  selectSuggestedReply: (reply: SuggestedReply) => void;
  source: string;
} & ConnectedProps<typeof connector>;

const SuggestedReplySelector = ({onClose, suggestions, selectSuggestedReply, source}: Props) => {
  const componentRef = useRef(null);

  return (
    <ListenOutsideClick onClose={onClose}>
      <div className={styles.component} ref={componentRef}>
        <div className={styles.suggestionList}>
          <Carousel>
            {Object.keys(suggestions).map(id => {
              const suggestion = suggestions[id];
              return (
                <div
                  className={styles.suggestionPreviewWrapper}
                  key={id}
                  onClick={() => {
                    selectSuggestedReply(suggestion);
                  }}>
                  <div className={styles.fadeOutWrapper}>
                    <SourceMessage message={{id: id, content: suggestion.content}} source={source} />
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </ListenOutsideClick>
  );
};

export default connector(SuggestedReplySelector);
