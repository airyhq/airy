import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

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

const initialState = {
  modal: {
    type: null,
    tagId: null,
    tagName: null,
    delete: '',
    error: '',
  },
  query: '',
  filteredTags: [],
  createDrawer: false,
  emptyState: true,
};

class Tags extends Component<ConnectedProps<typeof connector>, typeof initialState> {
  state = initialState;

  componentDidMount() {
    setPageTitle('Tags');
    this.props.listTags();
  }

  handleSearch = (query: string) => {
    this.setState({
      query,
      filteredTags: this.props.tags.filter(t => t.name.toLowerCase().match(query.toLocaleLowerCase())),
    });
  };

  handleDelete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    this.setState((state: ModalType) => {
      return {
        modal: {
          ...state.modal,
          delete: e.target?.value,
        },
      };
    });
  };

  handleTagDrawer = () => {
    this.setState({
      createDrawer: !this.state.createDrawer,
    });
    this.props.errorTag('');
  };

  removeEmptyStateAndCreateTag = () => {
    this.setState({emptyState: false});
    this.handleTagDrawer();
  };

  keyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      e.preventDefault();
      this.confirmDelete();
    } else if (code === 27) {
      e.preventDefault();
      this.closeModal();
    }
  };

  showModal = (modalType: string, id: string, name: string) => {
    this.setState({
      modal: {
        type: modalType,
        tagId: id,
        tagName: name,
        delete: '',
        error: '',
      },
    });
  };

  closeModal = () => {
    this.setState({
      modal: {
        type: null,
        tagId: null,
        tagName: '',
        delete: '',
        error: '',
      },
    });
  };

  confirmDelete = () => {
    if (this.state.modal.delete.toLowerCase() === 'delete') {
      this.props.deleteTag(this.state.modal.tagId);
      this.closeModal();
    } else {
      this.setState((state: ModalType) => {
        return {
          modal: {
            ...state.modal,
            error: "Please type 'delete' in the input field before deleting",
          },
        };
      });
    }
  };

  renderConfirmDelete = () => {
    if (this.state.modal.type === 'confirmDelete') {
      return (
        <SettingsModal
          style={{maxWidth: '480px'}}
          title="Are you sure you want to permanently delete this tag?"
          close={this.closeModal}
        >
          <div className={styles.confirmDelete}>
            <p>
              You&#39;re about to permanently delete <strong>&#34;{this.state.modal.tagName}&#34;</strong> from your
              organization&#39;s tags.
            </p>
            <p>
              <strong>This action cannot be undone.</strong> Once you delete the tag, no one in your organization will
              be able to use it. It will also removed from all corresponding contacts.
            </p>
            <p>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <Input
              height={32}
              fontClass="font-m"
              value={this.state.modal.delete}
              onChange={this.handleDelete}
              onKeyDown={this.keyPressed}
              autoFocus={true}
              dataCy={cyTagsTableRowDisplayDeleteModalInput}
            />
            <p className={styles.errorMessage}>{this.state.modal.error}</p>
            <div className={styles.confirmDeleteActions}>
              <LinkButton onClick={this.closeModal}>Cancel</LinkButton>
              <Button
                styleVariant="warning"
                onClick={this.confirmDelete}
                dataCy={cyTagsTableRowDisplayDeleteModalButton}
              >
                Delete
              </Button>
            </div>
          </div>
        </SettingsModal>
      );
    }
  };

  renderTagList() {
    const tags = this.state.query !== '' ? this.state.filteredTags : this.props.tags;
    return (
      <div className={styles.cardRaised}>
        <div>
          <h1 className={styles.organizationSectionHeadline}>Tags</h1>
        </div>
        <div className={styles.organizationContainer} key="1">
          <div className={styles.tagsHeader}>
            <div className={styles.searchContainer}>
              <SearchField
                placeholder="Search for tags"
                value={this.state.query}
                setValue={this.handleSearch}
                dataCy={cyTagsSearchField}
              />
            </div>
            <button onClick={this.handleTagDrawer} className={styles.addButton}>
              Add tag <Plus className={styles.plusButton} />
            </button>
          </div>
          {this.state.createDrawer && <SimpleTagForm onClose={this.handleTagDrawer} />}
          {tags.length > 0 ? (
            <table className={styles.tagsTable} data-cy={cyTagsTable}>
              <tbody>
                <tr>
                  <th className={styles.tagsTableHeader}>Tag name</th>
                  <th className={styles.tagsTableHeader}>Color</th>
                  <th />
                </tr>
                {tags.map(tag => (
                  <TableRow key={tag.id} tag={tag} showModal={this.showModal} />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <h1 className={styles.noResultHeadline}>Result not found.</h1>
              <p>Try to search for a different term.</p>
            </div>
          )}
        </div>
        {this.renderConfirmDelete()}
      </div>
    );
  }

  render() {
    const {allTagsCount} = this.props;
    return (
      <div className={styles.tagsWrapper}>
        {allTagsCount == 0 && this.state.emptyState ? (
          <EmptyStateTags removeEmptyState={this.removeEmptyStateAndCreateTag} />
        ) : (
          this.renderTagList()
        )}
      </div>
    );
  }
}

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

export default connector(Tags);
