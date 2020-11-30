import React, {Component} from 'react';
// import ReactGA from 'react-ga';
// import {WithTranslation, withTranslation} from 'react-i18next';
// import {connect, ConnectedProps} from 'react-redux';
// import {getOrganizationId} from 'airy-client/model/User';

// import {SearchField} from '@airyhq/components';
// import {AccessibleSVG} from 'components';

// import IconSearch from 'assets/images/icons/search.svg';
// import BackIcon from 'assets/images/icons/arrow-left-2.svg';
// import {setSearch, resetFilteredConversationAction} from 'airy-client/actions/conversationsFilter';

// import styles from './ConversationListHeader.module.scss';

// const initialState = {
//   isShowingSearchInput: false,
//   search: '',
// };

// const mapStateToProps = state => {
//   return {
//     user: state.data.user,
//   };
// };

// const mapDispatchToProps = {
//   setSearch,
//   resetFilteredConversationAction,
// };

// const connector = connect(mapStateToProps, mapDispatchToProps);

// class ConversationListHeader extends Component<
//   ConnectedProps<typeof connector> & WithTranslation,
//   typeof initialState
// > {
//   state = initialState;

//   componentDidMount() {
//     this.props.resetFilteredConversationAction();
//   }

//   onClickSearch = () => {
//     if (this.state.isShowingSearchInput) {
//       this.props.setSearch(getOrganizationId(this.props.user), null);
//     }
//     this.setState({isShowingSearchInput: !this.state.isShowingSearchInput});
//     ReactGA.event({
//       category: 'Search',
//       action: 'Filter by search query',
//       label: 'Conversations header',
//     });
//   };

//   onClickBack = () => {
//     this.props.setSearch(getOrganizationId(this.props.user), null);
//     this.setState({isShowingSearchInput: !this.state.isShowingSearchInput, search: ''});
//   };

//   handleSearch = value => {
//     this.props.setSearch(getOrganizationId(this.props.user), value);
//   };

//   setValue = value => {
//     this.setState({search: value});
//     this.handleSearch(value);
//   };

//   render() {
//     const {t} = this.props;
//     const renderSearchInput = this.state.isShowingSearchInput ? (
//       <div className={styles.containerSearchField}>
//         <button type="button" className={styles.backButton} onClick={this.onClickBack}>
//           <AccessibleSVG className={styles.backIcon} src={BackIcon} />
//         </button>
//         <div className={styles.searchFieldWidth}>
//           <SearchField
//             placeholder={t('messenger.messageList.searchPlaceholder')}
//             value={this.state.search}
//             setValue={this.setValue}
//             resetClicked={this.onClickSearch}
//             autoFocus={true}
//           />
//         </div>
//       </div>
//     ) : (
//       <div className={styles.containerSearchHeadline}>
//         <div className={styles.headline}>{t('messenger.messageList.main_title')}</div>
//         <div className={styles.searchBox}>
//           <button type="button" className={styles.searchButton} onClick={this.onClickSearch}>
//             <AccessibleSVG className={styles.searchIcon} src={IconSearch} title={t('messenger.messageList.search')} />
//           </button>
//         </div>
//       </div>
//     );

//     return <div className={styles.containerSearch}>{renderSearchInput}</div>;
//   }
// }

// export default connector(withTranslation()(ConversationListHeader));
