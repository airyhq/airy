import React, {useCallback, useEffect, useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {listTemplates} from '../../../actions/templates';
import {SuggestedReply} from 'httpclient';
import {StateModel} from '../../../reducers';
import {SourceMessage} from 'render';

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

  const keyDown = useCallback(
    e => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const clickedOutside = useCallback(
    e => {
      if (componentRef.current === null || componentRef.current.contains(e.target)) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('click', clickedOutside);

    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('click', clickedOutside);
    };
  }, [keyDown, clickedOutside]);

  return (
    <div className={styles.component} ref={componentRef}>
      <div className={styles.templateList}>
        {Object.keys(suggestions).map(id => {
          const suggestion = suggestions[id];
          return (
            <div
              className={styles.templatePreviewWrapper}
              key={id}
              onClick={() => {
                selectSuggestedReply(suggestion);
              }}>
              <SourceMessage message={{id: id, content: suggestion.content}} source={source} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connector(SuggestedReplySelector);
