import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {WithTranslation, withTranslation} from 'react-i18next';
// import _, {connect, ConnectedProps} from 'react-redux';
// import ReactGA from 'react-ga';
// import {AccessibleSVG} from 'components';
// import IconChannel from 'components/general/IconChannel';

// import conversationDone from 'assets/images/icons/checkmark-circle.svg';
// import templates from 'assets/images/icons/templates.svg';

// import styles from './ConversationListItem.module.scss';

// import {formatTimeOfMessage} from '../../../services/format/date';
// import {toggleConversationStatus} from 'airy-client/actions/conversations';
// import {toggleState} from '../../../services/conversation';
// import {MESSENGER_CONVERSATIONS_ROUTE} from '../../../routes/routes';
// import {Conversation, Message} from 'airy-client';

// const ConversationStatus = ({t, status, onClick}) => {
//   if (status === 'CLOSED') {
//     return (
//       <button type="button" onClick={onClick} className={styles.openDoneToggle}>
//         <AccessibleSVG className={styles.doneIcon} src={conversationDone} title={t('messenger.setToOpen')} />
//       </button>
//     );
//   }

//   return (
//     <button onClick={onClick} className={styles.openDoneToggle}>
//       <div className={styles.openIcon} title={t('messenger.setToDone')} />
//     </button>
//   );
// };

// const FormattedMessage = ({t, message}) => {
//   if (message && message.preview && message.preview.content_type === 'text') {
//     return message.preview.display_text;
//   }

//   return <AccessibleSVG className={styles.conversationIcon} src={templates} title={t('messenger.otherSent')} />;
// };

// const mapStateToProps = state => {
//   return {
//     contacts: state.data.contacts.items,
//     channels: state.data.channels.data,
//   };
// };

// const mapDispatchToProps = {
//   toggleConversationStatus,
// };

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type Props = {
//   conversation: Conversation & {unread_message_count: number; message?: Message};
//   active: boolean;
//   style: any;
// } & ConnectedProps<typeof connector> &
//   WithTranslation;

// class ConversationListItem extends Component<Props, null> {
//   toggleConversationState = () => {
//     const newState = toggleState(this.props.conversation.state);

//     ReactGA.event({
//       category: 'Conversation status',
//       action: `Click change status to ${newState}`,
//       label: 'Conversation list',
//     });
//     this.props.toggleConversationStatus(this.props.conversation.id, newState);
//   };

//   render() {
//     const {t, conversation, active, style} = this.props;
//     const participant = this.props.contacts[this.props.conversation.id];
//     const unread = conversation.unread_message_count > 0;

//     return (
//       <div className={styles.clickableListItem} style={style}>
//         <Link to={`${MESSENGER_CONVERSATIONS_ROUTE}/${conversation.id}`}>
//           <div
//             className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
//               unread ? styles.unread : ''
//             }`}>
//             <div
//               className={styles.profileImage}
//               style={{backgroundImage: `url(${participant && participant.avatar_url})`}}
//             />
//             <div className={styles.contactDetails}>
//               <div className={styles.topRow}>
//                 <div className={`${styles.profileName} ${unread ? styles.unread : ''}`}>
//                   {participant && participant.display_name}
//                 </div>
//                 <div className={styles.statusIcon}>
//                   <ConversationStatus t={t} onClick={this.toggleConversationState} status={conversation.state} />
//                 </div>
//               </div>
//               <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
//                 <FormattedMessage t={t} message={conversation.message} />
//               </div>
//               <div className={styles.bottomRow}>
//                 <div className={styles.source}>
//                   <IconChannel channel={conversation.channel} avatar={true} name={true} />
//                 </div>
//                 <div className={styles.contactLastMessageDate}>{formatTimeOfMessage(conversation.message)}</div>
//               </div>
//             </div>
//           </div>
//         </Link>
//       </div>
//     );
//   }
// }

// export default connector(withTranslation()(ConversationListItem));
