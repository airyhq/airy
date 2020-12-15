import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import {SettingsModal, LinkButton, Button, SearchField, Input} from '@airyhq/components';

import plus from '../../assets/images/icons/plus.svg';

import {getTags, deleteTag, filterTags, errorTag} from '../../actions/tags';
import {fakeSettingsAPICall} from '../../actions/settings';
import {filteredTags} from '../../selectors/tags';
import {Tag} from '../../model/Tag';

import styles from './index.module.scss';
import {TableRow} from './TableRow';
import SimpleTagForm from './SimpleTagForm';
import EmptyStateTags from './EmptyStateTags';
import {RootState} from '../../reducers';
import {ModalType} from '../../model/Tag';

const initialState = {
  modal: {
    type: null,
    tagId: null,
    tagName: null,
    delete: '',
    error: '',
  },
  tagQuery: '',
  createDrawer: false,
};

class TagsComponent extends Component<ConnectedProps<typeof connector>, typeof initialState> {
  state = initialState;

  componentDidMount() {
    this.props.getTags();
    this.props.fakeSettingsAPICall();
    this.props.filterTags('');
  }

  handleSearch = (value: string) => {
    this.setState({
      tagQuery: value,
    });
    this.props.filterTags(value);
  };

  handleDelete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    this.setState((state: ModalType) => {
      return {
        modal: {
          ...state.modal,
          delete: e.target && e.target.value,
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
          close={this.closeModal}>
          <div className={styles.confirmDelete}>
            <p>
              You're about to permanently delete <strong>"{this.state.modal.tagName}"</strong> from your organization's
              tags.
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
            />
            <p className={styles.errorMessage}>{this.state.modal.error}</p>
            <div className={styles.confirmDeleteActions}>
              <LinkButton onClick={this.closeModal}>Cancel</LinkButton>
              <Button styleVariant="warning" onClick={this.confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </SettingsModal>
      );
    }
  };

  renderTagList() {
    const {tags} = this.props;
    return (
      <div className={styles.cardRaised}>
        <header>
          <h1 className={styles.organizationSectionHeadline}>Tags</h1>
        </header>
        <div className={styles.organizationContainer} key="1">
          <div className={styles.tagsHeader}>
            <div className={styles.searchContainer}>
              <SearchField placeholder="Search for tags" value={this.state.tagQuery} setValue={this.handleSearch} />
            </div>
            <button onClick={this.handleTagDrawer} className={styles.addButton}>
              Add tag <img className={styles.plusButton} src={plus} />
            </button>
          </div>
          {this.state.createDrawer && <SimpleTagForm onClose={this.handleTagDrawer} />}
          {tags.length > 0 ? (
            <table className={styles.tagsTable}>
              <tbody>
                <tr>
                  <th className={styles.tagsTableHeader}>Tag name</th>
                  <th className={styles.tagsTableHeader}>Color</th>
                  <th />
                </tr>
                {tags &&
                  tags.map((tag: Tag, idx: number) => {
                    return <TableRow key={idx} tag={tag} showModal={this.showModal} />;
                  })}
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
    return <div className={styles.tagsWrapper}>{allTagsCount == 0 ? <EmptyStateTags /> : this.renderTagList()}</div>;
  }
}

const mapStateToProps = (state: RootState) => ({
  tags: filteredTags(state),
  allTagsCount: state.data.tags.all.length,
  tagQuery: state.data.tags.query,
  errorMessage: state.data.tags.error,
  userData: state.data.user,
});

const mapDispatchToProps = {
  getTags,
  deleteTag,
  errorTag,
  filterTags,
  fakeSettingsAPICall,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const Tags = connector(TagsComponent);
