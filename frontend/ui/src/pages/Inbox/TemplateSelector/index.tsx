import React, {useState, useCallback, useEffect, useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {listTemplates} from '../../../actions/templates';
import {SearchField, ErrorNotice} from '@airyhq/components';
import {Template} from 'httpclient';
import {StateModel} from '../../../reducers';
import emptyState from 'assets/images/empty-state/templates-empty-state.png';
import notFoundState from 'assets/images/not-found/templates-not-found.png';
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
  selectTemplate: (t: Template) => void;
  sourceType: string;
} & ConnectedProps<typeof connector>;

const TemplateSelector = ({listTemplates, onClose, templates, selectTemplate, sourceType}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templatesList, setTemplatesList] = useState(templates);
  const [loading, setLoading] = useState(true);
  const [listTemplatesError, setListTemplatesError] = useState(false);
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

  useEffect(() => {
    templates = templates.filter((template: Template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTemplatesList(templates);
  }, [searchQuery, templates]);

  useEffect(() => {
    const listAllTemplatesFromSourcePayload = {source: sourceType};
    let abort = false;

    if (templates.length === 0 && loading) {
      listTemplates(listAllTemplatesFromSourcePayload)
        .then(() => {
          if (templates.length === 0 && !abort) setLoading(false);
        })
        .catch(() => {
          if (!abort) setListTemplatesError(true);
        });
    }

    return () => {
      abort = true;
    };
  }, [templates, loading]);

  const renderEmpty = () => {
    return (
      <div className={styles.emptyMessage}>
        <img className={styles.emptyImagePlaceholder} src={emptyState} alt="No templates" />
        <div className={styles.emptyMessageText}>
          <h1>You have no templates yet.</h1>
          <div className={styles.emptySeparator} />
          <p>Templates allow you to offer a richer interaction experience with images and buttons.</p>
          <p>Use text templates to never type the same thing again.</p>
        </div>
      </div>
    );
  };

  const renderNotFound = () => {
    return (
      <div className={styles.notFoundMessage}>
        <div className={styles.notFoundImage} style={{backgroundImage: `url(${notFoundState})`}}></div>
        <div className={styles.notFoundText}>
          <h2>No result found.</h2>
          <p>Did you write everything correctly?</p>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return <ErrorNotice theme="error">Oops! Your templates could not be loaded. Please try again later.</ErrorNotice>;
  };

  return (
    <div className={styles.component} ref={componentRef}>
      {listTemplatesError && !searchQuery ? (
        renderError()
      ) : !loading && templates.length === 0 && !searchQuery ? (
        renderEmpty()
      ) : (
        <>
          <div className={styles.topLine}>
            <div className={styles.searchField}>
              <SearchField
                value={searchQuery}
                setValue={(value: string) => setSearchQuery(value)}
                autoFocus={true}
                placeholder="Search for templates"
              />
            </div>
          </div>
          {templatesList.length === 0 && searchQuery.length > 0 ? (
            renderNotFound()
          ) : (
            <div className={styles.templateList}>
              {templatesList &&
                templatesList.map((template, id) => {
                  const templateContent = JSON.parse(template.content) as any;
                  return (
                    <div
                      className={styles.templatePreviewWrapper}
                      key={id}
                      onClick={() => {
                        selectTemplate(template);
                      }}>
                      <div className={styles.tempatePreviewName}>{template.name}</div>
                      <SourceMessage message={{id: template.id, content: templateContent}} source={template.source} />
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default connector(TemplateSelector);
