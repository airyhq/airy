import React, {useState, useEffect, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ListenOutsideClick} from 'components';
import styles from './index.module.scss';
import {listTemplates} from '../../../actions/templates';
import {SearchField, ErrorNotice} from 'components';
import {Template, Source} from 'model';
import {StateModel} from '../../../reducers';
import emptyState from 'assets/images/emptyState/templatesEmptyState.png';
import notFoundState from 'assets/images/notFound/templatesNotFound.png';
import {SourceMessage} from 'render';

const mapDispatchToProps = {
  listTemplates,
};

const mapStateToProps = (state: StateModel) => {
  return {
    templates: state.data.templates.all,
    templatesSource: state.data.templates.source,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  onClose: () => void;
  selectTemplate: (t: Template) => void;
  source: Source;
} & ConnectedProps<typeof connector>;

const TemplateSelector = ({listTemplates, onClose, templates, selectTemplate, source, templatesSource}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templatesList, setTemplatesList] = useState(templates);
  const [listTemplatesError, setListTemplatesError] = useState(false);

  const componentRef = useRef(null);

  useEffect(() => {
    templates = templates.filter((template: Template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTemplatesList(templates);
  }, [searchQuery, templates]);

  useEffect(() => {
    const listAllTemplatesFromSourcePayload = {source: source};
    let abort;

    if (source !== templatesSource) {
      listTemplates(listAllTemplatesFromSourcePayload)
        .then()
        .catch(() => {
          if (!abort) setListTemplatesError(true);
        });
    }

    return () => {
      abort = true;
    };
  }, [source, templatesSource]);

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
        <div className={styles.notFoundImage} style={{backgroundImage: `url(${notFoundState})`}} />
        <div className={styles.notFoundText}>
          <h2>No result found.</h2>
          <p>Did you write everything correctly?</p>
        </div>
      </div>
    );
  };

  return (
    <ListenOutsideClick onOuterClick={onClose}>
      <div className={styles.container} ref={componentRef}>
        {listTemplatesError ? (
          <ErrorNotice theme="error">Oops! Your templates could not be loaded. Please try again later.</ErrorNotice>
        ) : templates.length === 0 && source === templatesSource ? (
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
                  templatesList.length &&
                  templatesList.map((template, id) => {
                    return (
                      <div
                        className={styles.templatePreviewWrapper}
                        key={id}
                        onClick={() => {
                          selectTemplate(template);
                        }}
                      >
                        <div className={styles.templatePreviewName}>{template.name}</div>
                        <SourceMessage message={template} source={template.source} contentType="template" />
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </ListenOutsideClick>
  );
};

export default connector(TemplateSelector);
