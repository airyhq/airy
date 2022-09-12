import {Pagination} from 'components';
import {Contact} from 'model';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {listContacts} from '../../actions/contacts';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import ContactInformation from './ContactInformation';
import ContactListItem from './ContactListItem';
import {EmptyState} from './EmptyState';
import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => ({
  contacts: Object.values(state.data.contacts.all.items),
  paginationData: state.data.contacts.all.paginationData,
});

const mapDispatchToProps = {
  listContacts,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactsProps = {} & ConnectedProps<typeof connector>;

const Contacts = (props: ContactsProps) => {
  const {listContacts, contacts, paginationData} = props;
  const {t} = useTranslation();
  const [conversationId, setConversationId] = useState('');
  const [currentContact, setCurrentContact] = useState<Contact>();
  const [editModeOn, setEditModeOn] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const [currentVisibleContactId, setCurrentVisibleContactId] = useState('');
  const listPageSize = 9;
  const fetchNextPage = 5;

  useEffect(() => {
    setPageTitle('Contacts');
    listContacts().catch((error: Error) => {
      console.error(error);
    });
  }, []);

  const pageSize = contacts.length >= listPageSize ? listPageSize : contacts.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const contactSorter = (a: Contact, b: Contact) => a.displayName?.localeCompare?.(b.displayName);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return contacts.sort(contactSorter).slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, contacts.length]);

  useEffect(() => {
    if (currentTableData?.[0]?.id) {
      setCurrentVisibleContactId(currentTableData[0].id);
      setCurrentContact(currentTableData[0]);
    }
  }, [currentTableData]);

  useEffect(() => {
    lastPage % fetchNextPage == 0 &&
      listContacts().catch((error: Error) => {
        console.error(error);
      });
  }, [currentPage]);

  const handleConversationId = (conversationId: string) => setConversationId(conversationId);

  const handleContact = (contact: Contact) => {
    setCurrentContact(contact);
  };

  const handleEditMode = (editMode: boolean) => {
    setEditModeOn(editMode);
  };

  const handleCancelEditing = (cancel: boolean) => {
    setCancelEdit(cancel);
  };

  const handlePageChange = (page: number) => {
    page > lastPage && setLastPage(page);
    setCurrentPage(page);
  };

  return (
    <>
      {contacts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className={styles.wrapper}>
            <div className={styles.headline}>
              <div>
                <h1 className={styles.headlineText}>Contacts</h1>
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.containerHeadline}>
                <h1>{t('contactName')}</h1>
                <h1>{t('conversations')}</h1>
                <h1>{t('manage')}</h1>
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactList}>
                  {currentTableData.map((contact: Contact) => (
                    <ContactListItem
                      key={contact.id}
                      contact={contact}
                      setContact={handleContact}
                      setConversationId={handleConversationId}
                      setEditModeOn={handleEditMode}
                      setCancelEdit={handleCancelEditing}
                      setCurrentVisibleContactId={setCurrentVisibleContactId}
                      currentVisibleContactId={currentVisibleContactId}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.paginationContainer}>
                <Pagination
                  totalCount={paginationData?.total}
                  pageSize={listPageSize}
                  pageCount={contacts.length >= pageSize ? pageSize : contacts.length}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
          <div>
            <ContactInformation
              conversationId={conversationId}
              contact={currentContact}
              editModeOn={editModeOn}
              setEditModeOn={handleEditMode}
              cancelEdit={cancelEdit}
            />
          </div>
        </>
      )}
    </>
  );
};

export default connector(Contacts);
