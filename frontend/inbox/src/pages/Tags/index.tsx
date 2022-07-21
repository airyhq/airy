import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {SettingsModal, LinkButton, Button, SearchField, Input} from 'components';
import {cyTagsSearchField, cyTagsTable} from 'handles';

import {ReactComponent as Plus} from 'assets/images/icons/plus.svg';

import {listTags, deleteTag, errorTag} from '../../actions/tags';

import {ModalType} from '../../types';

import {TableRow} from './TableRow';
import SimpleTagForm from './SimpleTagForm';
import EmptyStateTags from './EmptyStateTags';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';

import styles from './index.module.scss';

import {cyTagsTableRowDisplayDeleteModalInput, cyTagsTableRowDisplayDeleteModalButton} from 'handles';
import {useTranslation} from 'react-i18next';
import {TagInitialState} from 'model/Tag';

const initialState = {
  modal: {
    type: null,
    tagId: null,
    tagName: null,
    delete: '',
    error: '',
  },
  filteredTags: [],
  emptyState: true,
};

const mapStateToProps = (state: StateModel) => ({
  tags: Object.values(state.data.tags.all),
  allTagsCount: Object.keys(state.data.tags.all).length,
  errorMessage: state.data.tags.error,
});

const mapDispatchToProps = {
  listTags,
  deleteTag,
  errorTag,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Tags = (props: ConnectedProps<typeof connector>) => {
  const {tags, allTagsCount, listTags, deleteTag, errorTag} = props;
  const {t} = useTranslation();
  const [state, setState] = useState<TagInitialState>(initialState);
  const [showDrawer, setShowDrawer] = useState(false);
  const [query, setQuery] = useState('');
  const currentTags = query !== '' ? state.filteredTags : tags;

  useEffect(() => {
    setPageTitle('Tags');
    listTags();
  }, []);

  const handleSearch = (query: string) => {
    setQuery(query);
    setState({
      filteredTags: tags.filter(t => t.name.toLowerCase().match(query.toLocaleLowerCase())),
    });
  };

  const handleDelete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setState((state: ModalType) => {
      return {
        modal: {
          ...state.modal,
          delete: e.target?.value,
        },
      };
    });
  };

  const handleTagDrawer = () => {
    setShowDrawer(!showDrawer);
    errorTag('');
  };

  const removeEmptyStateAndCreateTag = () => {
    setState({emptyState: false});
    handleTagDrawer();
  };

  const keyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      e.preventDefault();
      confirmDelete();
    } else if (code === 27) {
      e.preventDefault();
      closeModal();
    }
  };

  const showModal = (modalType: string, id: string, name: string) => {
    setState({
      modal: {
        type: modalType,
        tagId: id,
        tagName: name,
        delete: '',
        error: '',
      },
    });
  };

  const closeModal = () => {
    setState({
      modal: {
        type: null,
        tagId: null,
        tagName: '',
        delete: '',
        error: '',
      },
    });
  };

  const confirmDelete = () => {
    if (state.modal.delete.toLowerCase() === 'delete') {
      deleteTag(state.modal.tagId);
      closeModal();
    } else {
      setState((state: ModalType) => {
        return {
          modal: {
            ...state.modal,
            error: `${t('deleteTagConfirm')}`,
          },
        };
      });
    }
  };

  const renderConfirmDelete = () => {
    if (state.modal?.type === 'confirmDelete') {
      return (
        <SettingsModal style={{maxWidth: '640px'}} title={t('deleteTagTextTitle')} close={closeModal}>
          <div className={styles.confirmDelete}>
            <p>
              {t('deleteTagText')}
              <strong>&#34;{state.modal.tagName}&#34;</strong>
              {t('deleteTagText2')}
            </p>
            <p>
              <strong>{t('deleteTagText3')}</strong>
              {t('deleteTagText4')}
            </p>
            <p>
              {t('deleteTagText5')}
              <strong>DELETE</strong>
              {t('deleteTagText6')}
            </p>
            <Input
              height={32}
              fontClass="font-m"
              value={state.modal.delete}
              onChange={handleDelete}
              onKeyDown={keyPressed}
              autoFocus={true}
              dataCy={cyTagsTableRowDisplayDeleteModalInput}
            />
            <p className={styles.errorMessage}>{state.modal.error}</p>
            <div className={styles.confirmDeleteActions}>
              <LinkButton onClick={closeModal}>{t('cancel')}</LinkButton>
              <Button styleVariant="warning" onClick={confirmDelete} dataCy={cyTagsTableRowDisplayDeleteModalButton}>
                {t('delete')}
              </Button>
            </div>
          </div>
        </SettingsModal>
      );
    }
  };

  const renderTagList = () => {
    return (
      <div className={styles.cardRaised}>
        <div>
          <h1 className={styles.organizationSectionHeadline}>Tags</h1>
        </div>
        <div className={styles.organizationContainer} key="1">
          <div className={styles.tagsHeader}>
            <div className={styles.searchContainer}>
              <SearchField
                placeholder={t('searchTags')}
                value={query}
                setValue={handleSearch}
                dataCy={cyTagsSearchField}
              />
            </div>
            <button onClick={handleTagDrawer} className={styles.addButton}>
              {t('addTag')} <Plus className={styles.plusButton} />
            </button>
          </div>
          {showDrawer && <SimpleTagForm onClose={handleTagDrawer} />}
          {currentTags?.length > 0 ? (
            <table className={styles.tagsTable} data-cy={cyTagsTable}>
              <tbody>
                <tr>
                  <th className={styles.tagsTableHeader}>{t('tagName')}</th>
                  <th className={styles.tagsTableHeader}>{t('color')}</th>
                  <th />
                </tr>
                {currentTags.map(tag => (
                  <TableRow key={tag.id} tag={tag} showModal={showModal} />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <h1 className={styles.noResultHeadline}>{t('noResults')}</h1>
              <p>{t('noResultsTerm')}</p>
            </div>
          )}
        </div>
        {renderConfirmDelete()}
      </div>
    );
  };

  return (
    <div className={styles.tagsWrapper}>
      {allTagsCount == 0 && state.emptyState ? (
        <EmptyStateTags removeEmptyState={removeEmptyStateAndCreateTag} />
      ) : (
        renderTagList()
      )}
    </div>
  );
};

export default connector(Tags);
