import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      //Chatplugin
      sendMessageInputPlaceholder: 'Start typing...',
      cancel: 'Cancel',
      endChat: 'End Chat',
      conversationEnded: 'Your conversation has ended.',

      //Topbar
      contactUs: 'Contact us',
      logout: 'Logout',
      releaseNotes: 'Release notes',

      //Inbox

      //MessageInput
      failedToUploadFileAgainLater: 'Failed to upload the file. Please try again later.',
      failedToUploadFile: 'Failed to upload the file',
      maximumSize: 'The maximum file size allowed for this source is ',
      fileTypeNotSupported: 'This file type is not supported by this source. Supported files: ',
      suggestions: 'Suggestions',
      loadingFile: 'loading file... ',
      enterMessage: 'Enter a message...',
      messagesDisabled: 'Sending messages is disabled because this channel was disconnected.',
      addALine: 'Shift + Enter to add line',
      files: 'Files',
      continueRecording: 'Continue recording',
      recordAudioClip: 'Record audio clip',

      //Audio Recording
      micAccessDenied:
        'Microphone access denied. Check your browser settings to make sure Airy has permission to access your microphone, and try again.',
      failedToUploadRecording: 'Failed to upload the audio recording. Please try again later.',

      //Conversation

      //Tag
      addATag: 'Add a tag',
      addTagName: 'Please enter a tag name',
      tagAlreadyAdded: 'Tag already added',
      addCapital: 'Add',
      pickColor: 'Pick a color',
      createTag: 'Create Tag',
      close: 'Close',
      plusAddTag: '+ Add Tag',
      noTagsYet: `You don't have tags yet.`,
      tagsExplanation:
        'Tags provide a useful way to group related conversations together and to quickly filter and search them.',
      createATag: 'Create a Tag',
      deleteTagConfirmation: `Please type 'delete' in the input field before deleting`,
      enterTagName: 'Please enter a tag name',
      editTag: 'Edit tag',
      deleteTag: 'Delete tag',

      //Contact
      setName: 'Set Name',
      seeAll: 'See all ',
      seeLess: ' See less',
      email: 'email',
      phone: 'phone',
      title: 'title',
      address: 'address',
      city: 'city',
      organization: 'organization',
      companyName: 'company name',
      contactCapital: 'Contact',
      otherConversationsContact: 'Other conversations for this contact:',
      conversationsContact: 'Conversations for this contact:',
      noResultsConverstation: 'No Results',
      contactName: 'Contact Name',
      conversations: 'Conversations',
      deleteContact: 'Delete Contact',
      deleteContactText: 'Are you sure you want to delete this contact?',

      //Status
      all: 'All',
      open: 'Open',
      closed: 'Closed',

      //Message
      showSuggestions: 'Show suggestions',
      dropFilesHere: 'Drop Files Here',
      conversationsWillAppearHere: 'Your conversations will appear here as soon as a contact messages you.',
      conversationsWillAppearHereText:
        'Airy Messenger only shows new conversations from the moment you connect at least one channel.',
      newMessagesWillAppearHere: 'Your new messages will appear here',
      newMessagesWillAppearHereText:
        'We start showing messages from the moment you connect a channel. Your conversations will appear here as soon as your contacts message you.',
      nothingFound: 'Nothing found',
      noMatchingConversations: 'We could not find a conversation matching your criterias.',

      //Metadata
      editDisplayName: 'Edit Display Name',

      //QuickFilter
      readUnread: 'Read/Unread',
      readOnly: 'Read Only',
      unreadOnly: 'Unread Only',
      stateCapital: 'State',
      byTags: 'By Tags',
      byChannel: 'By Channel',
      bySource: 'By Source',
      searchTags: 'Search for Tags',
      searchChannel: 'Search for Channel',
      apply: 'Apply',
      clearAll: 'Clear All',

      //Templates
      templates: 'Templates',
      noTemplatesYet: 'You have no templates yet.',
      templatesExplanation: 'Templates allow you to offer a richer interaction experience with images and buttons.',
      useTemplates: 'Use text templates to never type the same thing again.',
      noResult: 'No result found.',
      writeCorrectly: 'Did you write everything correctly?',
      errorTemplates: 'Oops! Your templates could not be loaded. Please try again later.',
      searchTemplates: 'Search for templates',

      //Control-Center

      //Channels
      chatpluginTitle: 'Chat Plugin',
      chatpluginDescription: 'Best of class browser messenger',
      facebookTitle: 'Facebook Messenger',
      facebookDescription: 'Connect multiple Facebook pages',
      googleTitle: 'Google Business Messages',
      googleDescription: 'Be there when people search',
      instagramTitle: 'Instagram',
      instagramDescription: 'Connect multiple Instagram pages',
      twilioSmsTitle: 'SMS',
      twilioSmsDescription: 'Deliver SMS with ease',
      twilioWhatsappTitle: 'WhatsApp',
      twilioWhatsappDescription: 'World #1 chat app',
      channel: 'channel',
      channels: 'channels',
      channelsCapital: 'Channels',
      disconnectChannel: 'Disconnect Channel',
      confirmDisconnectChannelTitle: 'Confirm Channel Disconnection',
      confirmDisconnectChannelText:
        'You are about to disconnect a channel. You will not receive any new messages in Airy or be able to send messages anymore.',
      confirmDisconnectChannelProblem: 'If you need help or experience a problem, please reach out to ',
      unableDisableChannel: 'Unable to disable Channel',
      unsubscribing: 'Unsubscribing...',
      tryAgain: 'Try again...',
      confirm: 'Confirm',
      disableChannels: 'Disable Channels',
      sureToDisable: 'Are you sure you want to disable all ',
      of: 'of',
      back: 'Back',
      manage: 'Manage',
      name: 'Name',
      edit: 'Edit',
      search: 'Search',
      save: 'Save',
      delete: 'Delete',
      deleteChannel: 'Do you really want to delete this channel?',
      addChanne: 'Add channel',
      infoButtonText: 'more information about this source',
      addChatplugin: 'Add Airy Live Chat to your website and application',
      displayName: 'Display Name',
      addDisplayName: 'Add a name',
      imageUrl: 'Image URL',
      imageUrlPlaceholder: '(optionally) add an image url',
      imageUrlHint: 'max. 1024x1024 pixel PNG',

      //Customize Chatplugin
      addCodeTagHead: 'Add this code inside the tag ',
      copyCode: 'Copy code',
      headTextColor: 'Header Text Color',
      subtitleTextColor: 'Subtitle Text Color',
      primaryColor: 'Primary Color',
      accentColor: 'Accent Color',
      backgroundColor: 'Background Color',
      inboundBackgroundColor: 'Inbound Background Color',
      inboundTextColor: 'Inbound Text Color',
      outboundBackgroundColor: 'Outbound Background Color',
      outboundTextColor: 'Outbound Text Color',
      unreadMessageDotColor: 'Unread Message Dot Color',
      headerText: 'Header Text',
      addTextOptional: '(optionally) add a text',
      subtitleText: 'Subtitle Text',
      startNewConversationText: 'Start new Conversation Text',
      chatpluginIconUrl: 'Chat Plugin Icon URL',
      inputIconUrl: 'Input Icon URL',
      customHostUrl: 'Custom Host URL',
      addImageurlOptional: '(optionally) add an image url',
      heightPx: 'Height (min 200px)',
      customHeightPlaceholder: '(optionally) add custom height',
      widthPx: 'Width (min 200px)',
      customWidthPlaceholder: '(optionally) add custom width',
      disabledForMobile: 'Disabled for Mobile',
      hideInputbar: 'Hide Input Bar',
      disableEmojis: 'Disable Emojis',
      useCustomFont: 'Use Custom Font',
      closingOptions: 'Closing Options',
      bubbleStateOptions: 'Bubble State Options',
      supportedFileTypes: 'Supported file types:',
      disableImages: 'Disable Images',
      disableVideos: 'Disable Videos',
      disableFiles: 'Disable Files',
      customFont: 'Custom Font: ',
      update: 'Update',
      addAName: 'Add a name',
      settings: 'Settings',
      installCustomize: 'Install & Customize',
      addLiveChatToWebsite: 'Add Airy Live Chat to your website and application',
      facebookPageId: 'Facebook Page ID',
      facebookPageIdPlaceholder: 'Add the Facebook Page ID',
      token: 'Token',
      tokenPlaceholder: 'Add the page Access Token',
      nameOptional: 'Name (optional)',
      nameFacebookPlaceholder: 'The standard name will be the same as the Facebook Page',
      imageUrlOptional: 'Image URL (optional)',
      addAnUrl: 'Add an URL',
      imageFacebookHint: 'The standard picture is the same as the Facebook Page',
      connectPage: 'Connect Page',
      updatePage: 'Update Page',
      errorMessage: 'Please check entered value',

      //Facebook Messenger

      connectMessenger: 'Connect Messenger',
      facebookConfiguration: 'The Facebook source requires the following configuration:',
      facebookConfigurationText:
        'An app id and an app secret so that the platform can send messages back via your Facebook application',
      facebookConfigurationText2:
        'A webhook integration so that the platform can ingest messages from your Facebook pages',
      facebookConfigurationText3: 'A page token for each facebook page you intend to integrate',
      facebookConfigurationText4: `Check Airy's Documentation`,
      facebookConfigurationText5: 'for more information.',

      //Google Business Messages

      agentId: 'Agent ID',
      googleAgentPlaceholder: 'Add the agent ID provided by your Google Partner',
      connectGoogle: 'Connect Google Business Messages',
      googleConfigurationText:
        'Google&apos;s Business Messages source requires the following configuration to send messages to your Airy Core instance:',
      googleAccountKey: 'A Google Service Account Key',
      googleKey: 'A Google Partner Key',
      googleConfigurationText2: `Check Airy's Documentation`,
      googleConfigurationText3: 'for more information.',

      //Instagram

      instagramAccount: 'Facebook Page ID connected to the Instagram account',
      instagramAccountPlaceholder: 'Add the Facebook Page ID',
      instagramAccountId: 'ID of the Instagram account',
      instagramAccountIdPlaceholder: 'Add the ID of the Instagram account',
      connectInstagram: 'Connect Instagram',
      instagramConfigurationText: 'The Instagram source requires the following configuration:',
      instagramConfigurationText2:
        'An app id and an app secret so that the platform can send messages back via your Instagram application',
      instagramConfigurationText3:
        'A webhook integration so that the platform can ingest messages from your Instagram pages',
      instagramConfigurationText4: 'A page token for each facebook page you intend to integrate',
      instagramConfigurationText5: `Check Airy's Documentation`,
      instagramConfigurationText6: 'for more information.',

      //Twilio

      twilioPhoneNumber: 'Twilio Phone Number',
      twilioPhoneNumberPlaceholder: 'Purchased Number +123456789',
      connectSmsNumber: 'Connect Sms Number',
      updateSmsNumber: 'Update Sms Number',

      connectWhatsapp: 'Connect Whatsapp',
      connectWithTwilio: 'Connect with Twilio First',
      twilioConfigurationText: 'Before you connect a number for SMS or Whatsapp, you must add a',
      twilioConfigurationText2: 'Twilio Auth Token',
      twilioConfigurationText3: 'to the',
      twilioConfigurationText4: 'airy.yaml',
      twilioConfigurationText5: 'file.',
      twilioConfigurationText6: 'After that, you have to buy a number.',
      twilioConfigurationText7: 'Check',
      twilioConfigurationText8: `Check Airy's Documentation`,
      twilioConfigurationText9: 'for more details.',
      connectWhatsappNumber: 'Connect Whatsapp Number',
      updateWhatsappNumber: 'Update Whatsapp Number',

      //Connectors

      noResults: 'Result not found.',
      noResultsTerm: 'Try to search for a different term.',
      noConnectorsFound: 'No Connectors Found',
      noConnectorsFoundTerm: `You don't have any connectors installed, please open the`,
      noConnectorsFoundMore: 'and explore more.',
      installed: 'Installed',
      notInstalled: 'Not Installed',

      //NotFound

      notFound: `Oops! We couldn't find that here.`,

      //Status

      status: 'Status',
      componentName: 'Component Name',
      healthStatus: 'Health Status',
      enabled: 'Enabled',

      //Webhooks

      errorOccurred: 'Error occurred',
      successfullySubscribed: 'Successfully Subscribed!',
      subscribeWebhook: 'Subscribe Webhook',
      updateWebhook: 'Update Webhook',
      unsubscribeWebhook: 'Unsubscribe Webhook',
      unsubscribeWebhookText: 'Are you sure ',
      unsubscribeWebhookText2: ' you want to unsubscribe ',
      unableToUnsubscribeWebhook: 'Unable to unsubscribe Webhook',
      subscribeCapital: 'Subscribe',
      updateCapital: 'Update',
      subscribing: 'Subscribing...',
      updating: 'Updating...',
      webhookCapslock: 'WEBHOOK',
      allEvents: 'ALL EVENTS',

      //Inbox

      //Tags
      deleteTagText: 'Are you sure you want to permanently delete this tag?',
    },
  },
  de: {
    translation: {
      //Chatplugin
      sendMessageInputPlaceholder: 'Eingabe...',
      cancel: 'Abbrechen',
      endChat: 'Chat verlassen',
      conversationEnded: 'Die Konversation wurde beendet.',

      //Topbar
      contactUs: 'Kontaktieren Sie uns',
      logout: 'Ausloggen',
      releaseNotes: 'Versionshinweise',

      //Inbox

      //MessageInput
      failedToUploadFileAgainLater:
        'Der Upload der Datei ist fehlgeschlagen. Bitte versuchen Sie es später noch einmal.',
      failedToUploadFile: 'Hochladen der Datei fehlgeschlagen',
      maximumSize: 'Die maximal zulässige Dateigröße für diese Quelle ist ',
      fileTypeNotSupported: 'Dieser Dateityp wird von dieser Quelle nicht unterstützt. Unterstützte Dateien: ',
      suggestions: 'Vorschläge',
      loadingFile: 'Datei laden... ',
      enterMessage: 'Nachricht eingeben...',
      messagesDisabled:
        'Das Senden von Nachrichten ist deaktiviert, da die Verbindung zu diesem Kanal unterbrochen wurde.',
      addALine: 'Shift + Enter zum Hinzufügen einer Zeile',
      files: 'Dateien',
      continueRecording: 'Aufnahme fortsetzen',
      recordAudioClip: 'Audiodatei aufnehmen',

      //Audio Recording
      micAccessDenied:
        'Mikrofonzugriff verweigert. Überprüfen Sie die Einstellungen Ihres Browsers, um sicherzustellen, dass Airy die Erlaubnis hat, auf Ihr Mikrofon zuzugreifen, und versuchen Sie es erneut.',
      failedToUploadRecording:
        'Der Upload der Audioaufnahme ist fehlgeschlagen. Bitte versuchen Sie es später noch einmal.',

      //Conversation

      //Tag
      addATag: 'Einen Tag hinzufügen',
      addTagName: 'Bitte geben Sie einen Tag-Namen ein',
      tagAlreadyAdded: 'Tag bereits hinzugefügt',
      addCapital: 'Hinzufügen',
      pickColor: 'Wählen Sie eine Farbe',
      createTag: 'Tag erstellen',
      close: 'Schließen',
      plusAddTag: '+ Tag hinzufügen',
      noTagsYet: 'Sie haben noch keine Tags.',
      tagsExplanation:
        'Tags bieten eine nützliche Möglichkeit, zusammenhängende Konversationen zu gruppieren und sie schnell zu filtern und zu durchsuchen.',
      createATag: 'Einen Tag erstellen',
      deleteTagConfirmation: `Bitte geben Sie vor dem Löschen 'löschen' in das Eingabefeld ein`,
      enterTagName: 'Bitte geben Sie einen Tag-Namen ein',
      editTag: 'Tag bearbeiten',
      deleteTag: 'Tag löschen',

      //Contact
      setName: 'Name festlegen',
      seeAll: 'Alle anzeigen ',
      seeLess: ' Weniger anzeigen',
      email: 'Email',
      phone: 'Telefon',
      title: 'Titel',
      address: 'Adresse',
      city: 'Stadt',
      organization: 'organisation',
      companyName: 'Firmenname',
      contactCapital: 'Kontakt',
      otherConversationsContact: 'Andere Gespräche für diesen Kontakt:',
      conversationsContact: 'Gespräche für diesen Kontakt:',
      contactName: 'Kontaktname',
      conversations: 'Konversationen',
      noResultsConverstation: 'keine Ergebnisse',
      deleteContact: 'Kontakt löschen',
      deleteContactText: 'Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?',

      //Status
      all: 'Alle',
      open: 'Offen',
      closed: 'Geschlossen',

      //Message
      showSuggestions: 'Vorschläge anzeigen',
      dropFilesHere: 'Dateien hier ablegen',
      conversationsWillAppearHere:
        'Ihre Unterhaltungen werden hier angezeigt, sobald Ihnen ein Kontakt eine Nachricht sendet.',
      conversationsWillAppearHereText:
        'Airy Messenger zeigt neue Unterhaltungen erst an, wenn Sie mindestens einen Kanal verbinden.',
      newMessagesWillAppearHere: 'Ihre neuen Nachrichten werden hier angezeigt',
      newMessagesWillAppearHereText:
        'Wir beginnen mit der Anzeige von Nachrichten, sobald Sie einen Kanal verbinden. Ihre Unterhaltungen werden hier angezeigt, sobald Ihre Kontakte Ihnen Nachrichten senden.',
      nothingFound: 'Nichts gefunden',
      noMatchingConversations: 'Wir konnten kein Gespräch finden, das Ihren Kriterien entspricht.',

      //Metadata
      editDisplayName: 'Anzeigename bearbeiten',

      //QuickFilter
      readUnread: 'Gelesen/Ungelesen',
      readOnly: 'Nur gelesen',
      unreadOnly: 'Nur ungelesen',
      stateCapital: 'Zustand',
      byTags: 'Nach Tags',
      byChannel: 'Nach Kanal',
      bySource: 'Nach Quelle',
      searchTags: 'Suche nach Tags',
      searchChannel: 'Suche nach Kanal',
      apply: 'Anwenden',
      clearAll: 'Alle entfernen',

      //Templates
      template: 'Vorlagen',
      noTemplatesYet: 'Sie haben noch keine Vorlagen.',
      templatesExplanation:
        'Mithilfe von Vorlagen können Sie die Interaktion mit Bildern und Schaltflächen bereichern.',
      useTemplates: 'Verwenden Sie Textvorlagen, um nie wieder das Gleiche zu tippen.',
      noResult: 'Kein Ergebnis gefunden.',
      writeCorrectly: 'Haben Sie alles richtig geschrieben?',
      errorTemplates: 'Huch! Ihre Vorlagen konnten nicht geladen werden. Bitte versuchen Sie es später noch einmal.',
      searchTemplates: 'Suche nach Vorlagen',

      //Control-Center

      //Channels
      chatpluginTitle: 'Chat Plugin',
      chatpluginDescription: 'Der beste Browser-Messenger seiner Klasse',
      facebookTitle: 'Facebook Messenger',
      facebookDescription: 'Mehrere Facebook-Seiten verbinden',
      googleTitle: 'Google Business Messages',
      googleDescription: 'Seien Sie dabei, wenn Menschen suchen',
      instagramTitle: 'Instagram',
      instagramDescription: 'Mehrere Instagram-Seiten verbinden',
      twilioSmsTitle: 'SMS',
      twilioSmsDescription: 'SMS-Versand mit Leichtigkeit',
      twilioWhatsappTitle: 'WhatsApp',
      twilioWhatsappDescription: 'Weltweite Chat-App Nr. 1',
      channel: 'Kanal',
      channels: 'Kanäle',
      channelsCapital: 'Kanäle',
      disconnectChannel: 'Kanal entfernen',
      confirmDisconnectChannelTitle: 'Bestätigung der Kanaltrennung',
      confirmDisconnectChannelText:
        'Sie sind dabei, die Verbindung zu einem Kanal zu trennen. Sie werden keine neuen Nachrichten in Airy erhalten und können keine Nachrichten mehr senden.',
      confirmDisconnectChannelProblem: 'Wenn Sie Hilfe benötigen oder ein Problem haben, wenden Sie sich bitte an ',
      unableDisableChannel: 'Kanal konnte nicht deaktiviert werden',
      unsubscribing: 'Abmelden...',
      tryAgain: 'Erneut versuchen...',
      confirm: 'Bestätigen',
      disableChannels: 'Kanäle deaktivieren',
      sureToDisable: 'Sind Sie sicher, dass Sie alle Funktionen deaktivieren möchten? ',
      of: 'von',
      back: 'Zurück',
      manage: 'Verwalten',
      name: 'Name',
      edit: 'Editieren',
      search: 'Suchen',
      save: 'Speichern',
      delete: 'Löschen',
      deleteChannel: 'Wollen Sie diesen Kanal wirklich löschen?',
      addChanne: 'Kanal hinzufügen',
      infoButtonText: 'mehr Informationen über diese Quelle',
      addChatplugin: 'Fügen Sie Airy Live Chat zu Ihrer Website und Anwendung hinzu',
      displayName: 'Anzeige Name',
      addDisplayName: 'Namen hinzufügen',
      imageUrl: 'Bild URL',
      imageUrlPlaceholder: '(optional) eine Bildurl hinzufügen',
      imageUrlHint: 'max. 1024x1024 Pixel PNG',

      //Customize Chatplugin
      addCodeTagHead: 'Fügen Sie diesen Code innerhalb des Tags ein ',
      copyCode: 'Code kopieren',
      headTextColor: 'Textfarbe der Kopfzeile',
      subtitleTextColor: 'Untertitel Textfarbe',
      primaryColor: 'Primärfarbe',
      accentColor: 'Akzentfarbe',
      backgroundColor: 'Hintergrundfarbe',
      inboundBackgroundColor: 'Eingehende Hintergrundfarbe',
      inboundTextColor: 'Eingehende Textfarbe',
      outboundBackgroundColor: 'Ausgehende Hintergrundfarbe',
      outboundTextColor: 'Ausgehende Textfarbe',
      unreadMessageDotColor: 'Farbe des Punktes für ungelesene Nachrichten',
      headerText: 'Kopfzeilentext',
      addTextOptional: '(optional) einen Text hinzufügen',
      subtitleText: 'Untertiteltext',
      startNewConversationText: 'Neue Konversation beginnen Text',
      chatpluginIconUrl: 'Chat-Plugin-Symbol-URL',
      inputIconUrl: 'Eingabe der Icon-URL',
      customHostUrl: 'Benutzerdefinierte Host-URL',
      addImageurlOptional: '(optional) eine Bildurl hinzufügen',
      heightPx: 'Höhe (mindestens 200px)',
      customHeightPlaceholder: '(optional) benutzerdefinierte Höhe hinzufügen',
      widthPx: 'Breite (mindestens 200px)',
      customWidthPlaceholder: '(optional) benutzerdefinierte Breite hinzufügen',
      disabledForMobile: 'Deaktiviert für Mobile',
      hideInputbar: 'Eingabeleiste ausblenden',
      disableEmojis: 'Emojis deaktivieren',
      useCustomFont: 'Benutzerdefinierte Schriftart verwenden',
      supportedFileTypes: 'Unterstützte Dateitypen:',
      disableImages: 'Bilder deaktivieren',
      disableVideos: 'Videos deaktivieren',
      disableFiles: 'Dateien deaktivieren',
      customFont: 'Benutzerdefinierte Schriftart: ',
      closingOptions: 'Optionen zum Schließen',
      bubbleStateOptions: 'Blasenstatus-Optionen',
      update: 'Aktualisieren',
      addAName: 'Namen hinzufügen',
      settings: 'Einstellungen',
      installCustomize: 'Installieren & Anpassen',
      addLiveChatToWebsite: 'Fügen Sie Airy Live Chat zu Ihrer Website und Anwendung hinzu',
      facebookPageId: 'Facebook-Seiten-ID',
      facebookPageIdPlaceholder: 'Fügen Sie die Facebook Seiten ID hinzu',
      token: 'Token',
      tokenPlaceholder: 'Hinzufügen des Seiten-Access-Token',
      nameOptional: 'Name (optional)',
      nameFacebookPlaceholder: 'Der Standardname wird derselbe sein wie der der Facebook-Seite',
      imageUrlOptional: 'Bild URL (optional)',
      addAnUrl: 'Fügen Sie eine URL hinzu',
      imageFacebookHint: 'Der Standardbild wird derselbe sein wie der der Facebook-Seite',
      connectPage: 'Seite verbinden',
      updatePage: 'Seite  aktualisieren',
      errorMessage: 'Bitte überprüfen Sie Ihre Eingabe',

      //Facebook Messenger

      connectMessenger: 'Messenger verbinden',
      facebookConfiguration: 'Die Facebook-Quelle erfordert die folgende Konfiguration:',
      facebookConfigurationText:
        'Eine App-ID und ein App-Geheimnis, damit die Plattform Nachrichten über Ihre Facebook-Anwendung zurücksenden kann',
      facebookConfigurationText2:
        'Eine Webhook-Integration, damit die Plattform Nachrichten von Ihren Facebook-Seiten aufnehmen kann',
      facebookConfigurationText3: 'Ein Seiten-Token für jede Facebook-Seite, die Sie integrieren möchten',
      facebookConfigurationText4: 'Prüfen Sie die Dokumentation von Airy',
      facebookConfigurationText5: 'für weitere Informationen.',

      //Google Business Messages

      agentId: 'Agent ID',
      googleAgentPlaceholder: 'Fügen Sie die von Ihrem Google-Partner bereitgestellte Agent-ID hinzu',
      connectGoogle: 'Google Business-Nachrichten verbinden',
      googleConfigurationText:
        'Die Google Business Messages-Quelle erfordert die folgende Konfiguration, um Nachrichten an Ihre Airy Core-Instanz zu senden:',
      googleAccountKey: 'Schlüssel für ein Google-Servicekonto',
      googleKey: 'Ein Google-Partner-Schlüssel',
      googleConfigurationText2: 'Prüfen Sie die Dokumentation von Airy',
      googleConfigurationText3: 'für weitere Informationen.',

      //Instagram

      instagramAccount: 'Facebook-Seiten-ID, die mit dem Instagram-Konto verbunden ist',
      instagramAccountPlaceholder: 'Hinzufügen der Facebook-Seiten-ID',
      instagramAccountId: 'ID des Instagram-Kontos',
      instagramAccountIdPlaceholder: 'Fügen Sie die ID des Instagram-Kontos hinzu',
      connectInstagram: 'Instagram verbinden',
      instagramConfigurationText: 'Die Instagram-Quelle erfordert die folgende Konfiguration:',
      instagramConfigurationText2:
        'Eine App-ID und ein App-Geheimnis, damit die Plattform Nachrichten über Ihre Instagram-Anwendung zurücksenden kann',
      instagramConfigurationText3:
        'Eine Webhook-Integration, damit die Plattform Nachrichten von Ihren Instagram-Seiten aufnehmen kann',
      instagramConfigurationText4: 'Ein Seiten-Token für jede Facebook-Seite, die Sie integrieren möchten',
      instagramConfigurationText5: 'Prüfen Sie die Dokumentation von Airy',
      instagramConfigurationText6: 'für weitere Informationen.',

      //Twilio

      twilioPhoneNumber: 'Twilio-Telefonnummer',
      twilioPhoneNumberPlaceholder: 'Gekaufte Nummer +123456789',
      connectSmsNumber: 'Sms-Nummer verbinden',
      updateSmsNumber: 'SMS-Nummer aktualisieren',

      connectWhatsapp: 'Whatsapp verbinden',
      connectWithTwilio: 'Zuerst mit Twilio verbinden',
      twilioConfigurationText: 'Bevor Sie eine Nummer für SMS oder Whatsapp verbinden, müssen Sie den',
      twilioConfigurationText2: 'Twilio Auth Token',
      twilioConfigurationText3: 'zu Ihrer',
      twilioConfigurationText4: 'airy.yaml',
      twilioConfigurationText5: 'Datei hinzufügen.',
      twilioConfigurationText6: 'Danach müssen Sie eine Nummer kaufen.',
      twilioConfigurationText7: 'Siehe',
      twilioConfigurationText8: 'Airys Dokumentation',
      twilioConfigurationText9: 'für weitere Informationen.',
      connectWhatsappNumber: 'Whatsapp-Nummer verbinden',
      updateWhatsappNumber: 'Whatsapp-Nummer aktualisieren',

      //Connectors

      noResults: 'Ergebnis nicht gefunden.',
      noResultsTerm: 'Versuchen Sie, nach einem anderen Begriff zu suchen.',
      noConnectorsFound: 'Keine Konnektoren gefunden',
      noConnectorsFoundTerm: 'Sie haben keine Konnektoren installiert, öffnen Sie bitte das',
      noConnectorsFoundMore: 'und erkunden Sie mehr.',
      installed: 'Installiert',
      notInstalled: 'Nicht Installiert',

      //NotFound

      notFound: 'Huch! Das konnten wir hier nicht finden.',

      //Status

      status: 'Status',
      componentName: 'Komponenten Name',
      healthStatus: 'Gesundheitszustand',
      enabled: 'Aktiviert',

      //Webhooks

      errorOccurred: 'Fehler aufgetreten',
      successfullySubscribed: 'Erfolgreich abonniert!',
      subscribeWebhook: 'Webhook abonnieren',
      updateWebhook: 'Webhook aktualisieren',
      unsubscribeWebhook: 'Webhook abbestellen',
      unsubscribeWebhookText: 'Sind Sie sicher, ',
      unsubscribeWebhookText2: 'dass Sie sich abmelden möchten',
      unableToUnsubscribeWebhook: 'Webhook kann nicht abbestellt werden',
      subscribeCapital: 'Abonnieren',
      updateCapital: 'Aktualisieren',
      subscribing: 'Abonnieren...',
      updating: 'Aktualisieren...',
      webhookCapslock: 'WEBHOOK',
      allEvents: 'ALLE EVENTS',
    },
  },
  fr: {
    translation: {
      //Chatplugin
      sendMessageInputPlaceholder: 'Engagez une conversation...',
      cancel: 'Annuler',
      endChat: 'Terminer la conversation',
      conversationEnded: 'Cette conversation est terminée.',

      //Topbar
      contactUs: 'Nous contacter',
      logout: 'Déconnexion',
      releaseNotes: 'Notes de version',

      //Inbox

      //MessageInput
      failedToUploadFileAgainLater: 'Le téléchargement du fichier a échoué. Veuillez réessayer plus tard.',
      failedToUploadFile: 'Impossible de télécharger le fichier',
      maximumSize: 'La taille maximale des fichiers autorisée pour cette source est de ',
      fileTypeNotSupported: `Ce type de fichier n'est pas pris en charge par cette source. Fichiers pris en charge : `,
      suggestions: 'Suggestions',
      loadingFile: 'chargement du fichier... ',
      enterMessage: 'Entrez un message..',
      messagesDisabled: `L'envoi de messages est désactivé car ce canal a été déconnecté.`,
      addALine: 'Shift + Enter pour ajouter une ligne',
      files: 'Fichiers',
      continueRecording: `Continuer l'enregistrement`,
      recordAudioClip: 'Enregistrer un clip audio',

      //Audio Recording
      micAccessDenied: `Accès au microphone refusé. Vérifiez les paramètres de votre navigateur pour vous assurer que Airy a l'autorisation d'accéder à votre microphone, et réessayez`,
      failedToUploadRecording: `Impossible de télécharger l'enregistrement audio. Veuillez réessayer plus tard.`,

      //Conversation

      //Tag
      addATag: 'Ajouter une étiquette',
      addTagName: `Veuillez entrer un nom d'étiquette`,
      tagAlreadyAdded: 'Étiquette déjà ajoutée',
      addCapital: 'Ajouter',
      pickColor: 'Choisissez une couleur',
      createTag: 'Créer une étiquette',
      close: 'Fermer',
      plusAddTag: '+ Ajouter une étiquette',
      noTagsYet: `Vous n'avez pas encore d'étiquettes.`,
      tagsExplanation:
        'Les étiquettes constituent un moyen utile de regrouper des conversations connexes et de les filtrer et de les rechercher rapidement.',
      createATag: 'Créer une étiquette',
      deleteTagConfirmation: `Veuillez entrer 'delete' dans le champ de saisie afin de procéder à la suppression.`,
      enterTagName: `Veuillez entrer un nom d'étiquette`,
      editTag: `Modifier l'étiquette`,
      deleteTag: `Supprimer l'étiquette`,

      //Contact
      setName: 'Ajouter un nom',
      seeAll: 'Voir tous ',
      seeLess: ' Voir moins',
      email: 'email',
      phone: 'téléphone',
      title: 'titre',
      address: 'adresse',
      city: 'ville',
      organization: 'organisation',
      companyName: `nom de l'entreprise`,
      contactCapital: 'Contacter',
      otherConversationsContact: 'Autres conversations de ce contact :',
      conversationsContact: 'Conversations de ce contact :',
      noResultsConverstation: 'Aucun Résultat',
      contactName: 'Nom du contact',
      conversations: 'Conversations',
      deleteContact: 'Supprimer le Contact',
      deleteContactText: 'Êtes-vous sûr de vouloir supprimer ce contact?',

      //Status
      all: 'Tous',
      open: 'Ouvrir',
      closed: 'Fermé',

      //Message
      showSuggestions: 'Afficher les suggestions',
      dropFilesHere: 'Déposez vos fichiers ici',
      conversationsWillAppearHere: `Vos conversations apparaîtront ici dès qu'un contact vous enverra un message.`,
      conversationsWillAppearHereText: `Airy Messenger n'affiche les nouvelles conversations qu'à partir du moment où vous connectez au moins un canal.`,
      newMessagesWillAppearHere: 'Vos nouveaux messages apparaîtront ici',
      newMessagesWillAppearHereText:
        'Nous commençons à afficher les messages à partir du moment où vous connectez un canal. Vos conversations apparaîtront ici dès que vos contacts vous enverront des messages.',
      nothingFound: 'Rien trouvé',
      noMatchingConversations: `Nous n'avons pas pu trouver de conversation correspondant à vos critères.`,

      //Metadata
      editDisplayName: `Modifier le nom d'affichage`,

      //QuickFilter
      readUnread: 'Lus/Non lus',
      readOnly: 'Lus seulement',
      unreadOnly: 'Non lus seulement',
      stateCapital: 'État',
      byTags: 'Par étiquette',
      byChannel: 'Par canal',
      bySource: 'Par source',
      searchTags: `Recherche d'étiquettes`,
      searchChannel: `Recherche d'un canal`,
      apply: 'Appliquer',
      clearAll: 'Effacer tout',

      //Templates
      templates: 'Modèles',
      noTemplatesYet: `Vous n'avez pas encore de modèles.`,
      templatesExplanation: `Les modèles vous permettent d'offrir une expérience d'interaction plus riche avec des images et des boutons.`,
      useTemplates: 'Utilisez des modèles de texte pour ne plus jamais taper la même chose.',
      noResult: 'Aucun résultat trouvé.',
      writeCorrectly: 'Avez-vous tout écrit correctement?',
      errorTemplates: `Oups! Vos modèles n'ont pas pu être chargés. Veuillez réessayer plus tard.`,
      searchTemplates: 'Recherche de modèles',

      //Control-Center

      //Channels
      chatpluginTitle: 'Chat Plugin',
      chatpluginDescription: 'Le meilleur chat de messagerie instantanée',
      facebookTitle: 'Facebook Messenger',
      facebookDescription: 'Connecter plusieurs pages Facebook',
      googleTitle: 'Google Business Messages',
      googleDescription: 'Soyez présent lorsque les gens font des recherches',
      instagramTitle: 'Instagram',
      instagramDescription: 'Connecter plusieurs pages Instagram',
      twilioSmsTitle: 'SMS',
      twilioSmsDescription: 'Envoyez des SMS en toute simplicité',
      twilioWhatsappTitle: 'WhatsApp',
      twilioWhatsappDescription: 'Première application de chat au monde',
      channel: 'canal',
      channels: 'canaux',
      channelsCapital: 'Canaux',
      disconnectChannel: 'Déconnecter du canal',
      confirmDisconnectChannelTitle: 'Confirmer la déconnexion du canal',
      confirmDisconnectChannelText:
        'Vous êtes sur le point de déconnecter un canal. Vous ne recevrez plus de nouveaux messages dans Airy et ne pourrez plus envoyer de messages.',
      confirmDisconnectChannelProblem: `Si vous avez besoin d'aide ou si vous rencontrez un problème, veuillez vous adresser à `,
      unableDisableChannel: 'Impossible de désactiver le canal',
      unsubscribing: 'Désabonnement...',
      tryAgain: 'Essayez encore...',
      confirm: 'Confirmer',
      disableChannels: 'Désactiver les canaux',
      sureToDisable: 'Êtes-vous sûr de vouloir désactiver tous les ',
      of: 'de',
      back: 'Précédent',
      manage: 'Gérer',
      name: 'Nom',
      edit: 'Modifier',
      search: 'Recherche',
      save: 'Sauvez',
      delete: 'Supprimer',
      deleteChannel: 'Voulez-vous vraiment supprimer ce canal?',
      addChanne: 'Ajouter un canal',
      infoButtonText: `plus d'informations sur cette source`,
      addChatplugin: 'Ajoutez Airy Live Chat à votre site web et à votre application.',
      displayName: `Nom d'affichage`,
      addDisplayName: 'Ajouter un nom',
      imageUrl: `URL d'une image`,
      imageUrlPlaceholder: `(facultatif) ajouter l'URL d'une image`,
      imageUrlHint: 'max. 1024x1024 pixel PNG',

      //Customize Chatplugin
      addCodeTagHead: `Ajoutez ce code à l'intérieur de la balise `,
      copyCode: 'Copier le code',
      headTextColor: `Couleur du texte de l'en-tête`,
      subtitleTextColor: 'Couleur du texte du sous-titre',
      primaryColor: 'Couleur primaire',
      accentColor: `Couleur d'accent`,
      backgroundColor: 'Couleur de fond',
      inboundBackgroundColor: `Couleur d'arrière-plan pour les messages entrants`,
      inboundTextColor: 'Couleur du texte entrant',
      outboundBackgroundColor: `Couleur d'arrière-plan pour les messages de sortie`,
      outboundTextColor: 'Couleur du texte sortant',
      unreadMessageDotColor: 'Couleur du point des messages non lus',
      headerText: `Texte d'en-tête`,
      addTextOptional: '(facultatif) ajouter un texte',
      subtitleText: 'Texte du sous-titre',
      startNewConversationText: 'Texte pour commencer une nouvelle conversation',
      chatpluginIconUrl: `URL de l'icône du bouton du chat`,
      inputIconUrl: `URL de l'icône du champ de saisie`,
      customHostUrl: `URL de l'hôte personnalisé`,
      addImageurlOptional: `(facultatif) ajouter l'URL d'une image`,
      heightPx: 'Hauteur (min 200px)',
      customHeightPlaceholder: '(facultatif) ajouter une hauteur personnalisée',
      widthPx: 'Largeur (min 200px)',
      customWidthPlaceholder: '(facultatif) ajouter une largeur personnalisée',
      disabledForMobile: 'Désactiver pour la version mobile',
      hideInputbar: 'Masquer la barre de saisie',
      disableEmojis: 'Désactiver les emojis',
      useCustomFont: 'Utiliser une police personnalisée',
      closingOptions: 'Options de clôture',
      bubbleStateOptions: `Options de l'état des bulles`,
      supportedFileTypes: 'Types de fichiers pris en charge :',
      disableImages: 'Désactiver les images',
      disableVideos: 'Désactiver les vidéos',
      disableFiles: 'Désactiver les fichiers',
      customFont: 'Police de caractères personnalisée : ',
      update: 'Mise à jour',
      addAName: 'Ajouter un nom',
      settings: 'Paramètres',
      installCustomize: 'Installation et personnalisation',
      addLiveChatToWebsite: 'Ajoutez Airy Live Chat à votre site web et à votre application.',
      
      

      //Facebook Messenger
      facebookPageId: 'ID de la page Facebook',
      facebookPageIdPlaceholder: `Ajoutez l'ID de la page Facebook`,
      token: 'Token',
      tokenPlaceholder: `Ajouter le token d'accès de la page`,
      nameOptional: 'Nom (facultatif)',
      nameFacebookPlaceholder: 'Le nom affiché sera le même que celui de la page Facebook.',
      imageUrlOptional: `Url de l'image (facultatif)`,
      addAnUrl: `Ajouter une URL`,
      imageFacebookHint: 'La photo affichée sera la même que celle de la page Facebook.',
      connectPage: 'Connecter la page',
      updatePage: `Actualiser la page`,
      errorMessage: 'Veuillez vérifier la valeur saisie',
      connectMessenger: 'Connecter le Messenger',
      facebookConfiguration: 'La source Facebook nécessite la configuration suivante:',
      facebookConfigurationText: `Un identifiant et un secret d'application pour que la plateforme puisse renvoyer des messages via votre application Facebook.`,
      facebookConfigurationText2:
        'Une intégration de webhook pour que la plateforme puisse ingérer les messages de vos pages Facebook.',
      facebookConfigurationText3: `Le token d'accès pour chaque page Facebook que vous souhaitez intégrer.`,
      facebookConfigurationText4: `Vérifiez la documentation d'Airy`,
      facebookConfigurationText5: `pour plus d'informations.`,

      //Google Business Messages

      agentId: `ID de l'agent`,
      googleAgentPlaceholder: `Ajoutez l'identifiant de l'agent fourni par votre partenaire Google`,
      connectGoogle: 'Connecter les messages Google Business',
      googleConfigurationText:
        'La source Business Messages de Google nécessite la configuration suivante pour envoyer des messages à votre instance Airy Core:',
      googleAccountKey: 'Une clé de compte de service Google',
      googleKey: 'Une clé de compte de service Google',
      googleConfigurationText2: `Vérifiez la documentation d'Airy`,
      googleConfigurationText3: `pour plus d'informations.`,

      //Instagram

      instagramAccount: 'ID de la page Facebook connectée au compte Instagram',
      instagramAccountPlaceholder: `Ajoutez l'ID de la page Facebook`,
      instagramAccountId: 'ID du compte Instagram',
      instagramAccountIdPlaceholder: `Ajoutez l'ID du compte Instagram`,
      connectInstagram: 'Connecter Instagram',
      instagramConfigurationText: 'La source Instagram nécessite la configuration suivante :',
      instagramConfigurationText2: `Un identifiant et un secret d'application pour que la plateforme puisse renvoyer des messages via votre application Instagram.`,
      instagramConfigurationText3:
        'Une intégration de webhook afin que la plateforme puisse ingérer les messages de vos pages Instagram.',
      instagramConfigurationText4: `Le token d'accès pour chaque page Facebook que vous souhaitez intégrer.`,
      instagramConfigurationText5: `Vérifiez la documentation d'Airy`,
      instagramConfigurationText6: `pour plus d'informations.`,

      //Twilio

      twilioPhoneNumber: 'Numéro de téléphone de Twilio',
      twilioPhoneNumberPlaceholder: 'Numéro acheté +123456789',
      connectSmsNumber: 'Connecter le numéro Sms',
      updateSmsNumber: 'Mise à jour du numéro Sms',

      connectWhatsapp: 'Connecter Whatsapp',
      connectWithTwilio: 'Connectez-vous avec Twilio First',
      twilioConfigurationText: 'Avant de connecter un numéro pour les SMS ou Whatsapp, vous devez ajouter un',
      twilioConfigurationText2: `Token d'authentification Twilio`,
      twilioConfigurationText3: 'au',
      twilioConfigurationText4: 'airy.yaml',
      twilioConfigurationText5: 'fichier.',
      twilioConfigurationText6: 'Après cela, vous devez acheter un numéro.',
      twilioConfigurationText7: 'Vérifiez',
      twilioConfigurationText8: `Vérifiez la documentation d'Airy`,
      twilioConfigurationText9: `pour plus d'informations.`,
      connectWhatsappNumber: 'Connecter le numéro Whatsapp',
      updateWhatsappNumber: 'Mise à jour du numéro Whatsapp',

      //Connectors

      noResults: 'Résultat non trouvé.',
      noResultsTerm: 'Essayez de rechercher un autre terme.',
      noConnectorsFound: 'Aucun connecteur trouvé',
      noConnectorsFoundTerm: `Vous n'avez pas de connecteurs installés, veuillez ouvrir l'application`,
      noConnectorsFoundMore: 'et explorer davantage.',
      installed: 'Installé(s)',
      notInstalled: 'Non installé(s)',

      //NotFound

      notFound: 'Oups! Page non trouvée.',

      //Status

      status: 'Statut',
      componentName: 'Nom du composant',
      healthStatus: 'État de santé',
      enabled: 'Activé',

      //Webhooks

      errorOccurred: `Une erreur s'est produite`,
      successfullySubscribed: 'Souscription réussie!',
      subscribeWebhook: 'Inscrire un webhook',
      updateWebhook: 'Mise à jour du Webhook',
      unsubscribeWebhook: 'Désinscrire le webhook',
      unsubscribeWebhookText: 'Vous êtes sûr de',
      unsubscribeWebhookText2: 'vouloir vous désabonner ',
      unableToUnsubscribeWebhook: 'Impossible de se désinscrire au webhook',
      subscribeCapital: 'Inscription au webhook',
      updateCapital: 'Mise à jour',
      subscribing: 'Inscription en cours...',
      updating: 'Mise à jour...',
      webhookCapslock: 'WEBHOOK',
      allEvents: 'TOUS LES ÉVÉNEMENTS',
    },
  },
  es: {
    translation: {
      //Chatplugin
      sendMessageInputPlaceholder: 'Empezar a escribir...',
      cancel: 'Cancelar',
      endChat: 'Dejar conversación',
      conversationEnded: 'La conversación ha terminado.',

      //Topbar
      contactUs: 'Contacta con nosotros',
      logout: 'Cerrar sesión',
      releaseNotes: 'Notas de publicación',

      //Inbox

      //MessageInput
      failedToUploadFileAgainLater: 'No se ha podido cargar el archivo. Por favor, inténtelo de nuevo más tarde.',
      failedToUploadFile: 'No se ha podido cargar el archivo',
      maximumSize: 'El tamaño máximo de archivo permitido para esta fuente es ',
      fileTypeNotSupported: 'Este tipo de archivo no es compatible con esta fuente. Archivos compatibles: ',
      suggestions: 'Sugerencias',
      loadingFile: 'Cargando el archivo... ',
      enterMessage: 'Introduzca un mensaje...',
      messagesDisabled: 'El envío de mensajes está desactivado porque este canal fue desconectado.',
      addALine: 'Shift + Enter para añadir una línea',
      files: 'Archivos',
      continueRecording: 'Seguir grabando',
      recordAudioClip: 'Grabar un clip de audio',

      //Audio Recording
      micAccessDenied:
        'Acceso al micrófono denegado. Comprueba la configuración de tu navegador para asegurarte de que Airy tiene permiso para acceder a tu micrófono y vuelve a intentarlo.',
      failedToUploadRecording: 'No se ha podido cargar la grabación de audio. Vuelve a intentarlo más tarde.',

      //Conversation

      //Tag
      addATag: 'Añadir una etiqueta',
      addTagName: 'Por favor, introduzca un nombre de etiqueta',
      tagAlreadyAdded: 'Etiqueta ya añadida',
      addCapital: 'Añadir',
      pickColor: 'Elige un color',
      createTag: 'Crear etiqueta',
      close: 'Cerrar',
      plusAddTag: '+ Añadir etiqueta',
      noTagsYet: 'Todavía no tienes etiquetas.',
      tagsExplanation:
        'Las etiquetas proporcionan una forma útil de agrupar conversaciones relacionadas y de filtrarlas y buscarlas rápidamente.',
      createATag: 'Crear una etiqueta',
      deleteTagConfirmation: 'Por favor, escriba "delete" en el campo de entrada antes de borrar',
      enterTagName: 'Por favor, introduzca un nombre de etiqueta',
      editTag: 'Editar etiqueta',
      deleteTag: 'Eliminar la etiqueta',

      //Contact
      setName: 'Editar Nombre',
      seeAll: 'Ver todo ',
      seeLess: ' Ver menos',
      email: 'email',
      phone: 'teléfono',
      title: 'título',
      address: 'dirección',
      city: 'ciudad',
      organization: 'organización',
      companyName: 'nombre de la empresa',
      contactCapital: 'Contacto',
      otherConversationsContact: 'Otras conversaciones para este contacto:',
      conversationsContact: 'Conversaciones para este contacto:',
      noResultsConverstation: 'Sin Resultados',
      contactName: 'Nombre de contacto',
      conversations: 'Conversaciones',
      deleteContact: 'Eliminar el Contacto',
      deleteContactText: '¿Estás seguro de que quieres eliminar este contacto?',

      //Status
      all: 'Todo',
      open: 'Abrir',
      closed: 'Cerrado',

      //Message
      showSuggestions: 'Mostrar sugerencias',
      dropFilesHere: 'Dejar los archivos aquí',
      conversationsWillAppearHere: 'Tus conversaciones aparecerán aquí en cuanto un contacto te envíe un mensaje.',
      conversationsWillAppearHereText:
        'Airy Messenger sólo muestra las nuevas conversaciones a partir del momento en que se conecta al menos un canal.',
      newMessagesWillAppearHere: 'Sus nuevos mensajes aparecerán aquí',
      newMessagesWillAppearHereText:
        'Empezamos a mostrar los mensajes desde el momento en que conectas un canal. Tus conversaciones aparecerán aquí tan pronto como tus contactos te envíen mensajes.',
      nothingFound: 'No se ha encontrado nada',
      noMatchingConversations: 'No hemos podido encontrar una conversación que se ajuste a sus criterios.',

      //Metadata
      editDisplayName: 'Editar el nombre de la pantalla',

      //QuickFilter
      readUnread: 'Leído/No leído',
      readOnly: 'Sólo lectura',
      unreadOnly: 'Sólo sin leer',
      stateCapital: 'Estado',
      byTags: 'Por Etiquetas',
      byChannel: 'Por el Canal',
      bySource: 'Por Proveedor',
      searchTags: 'Búsqueda de etiquetas',
      searchChannel: 'Buscar el canal',
      apply: 'Aplicar',
      clearAll: 'Borrar todo',

      //Templates
      templates: 'Plantillas',
      noTemplatesYet: 'Todavía no tienes plantillas.',
      templatesExplanation:
        'Las plantillas permiten ofrecer una experiencia de interacción más rica con imágenes y botones.',
      useTemplates: 'Utilice plantillas de texto para no volver a escribir lo mismo.',
      noResult: 'No se ha encontrado ningún resultado.',
      writeCorrectly: '¿Has escrito todo correctamente?',
      errorTemplates: '¡Ups! No se han podido cargar sus plantillas. Por favor, inténtelo más tarde.',
      searchTemplates: 'Búsqueda de plantillas',

      //Control-Center

      //Channels
      chatpluginTitle: 'Chat Plugin',
      chatpluginDescription: 'El mejor navegador de su clase',
      facebookTitle: 'Facebook Messenger',
      facebookDescription: 'Conectar varias páginas de Facebook',
      googleTitle: 'Google Business Messages',
      googleDescription: 'Esté presente cuando la gente busque',
      instagramTitle: 'Instagram',
      instagramDescription: 'Conectar varias páginas de Instagram',
      twilioSmsTitle: 'SMS',
      twilioSmsDescription: 'Envío de SMS con facilidad',
      twilioWhatsappTitle: 'WhatsApp',
      twilioWhatsappDescription: 'La aplicación de mensajería número 1 del mundo',
      channel: 'canal',
      channels: 'canales',
      channelsCapital: 'Canales',
      disconnectChannel: 'Desconectar el canal',
      confirmDisconnectChannelTitle: 'Confirmar la desconexión del canal',
      confirmDisconnectChannelText:
        'Estás a punto de desconectar un canal. No recibirás ningún mensaje nuevo en Airy ni podrás volver a enviar mensajes.',
      confirmDisconnectChannelProblem: 'Si necesita ayuda o tiene algún problema, póngase en contacto con ',
      unableDisableChannel: 'No se puede desactivar el canal',
      unsubscribing: 'Cancelar la suscripción...',
      tryAgain: 'Inténtalo de nuevo...',
      confirm: 'Confirmar',
      disableChannels: 'Desactivar Canales',
      sureToDisable: '¿Está seguro de que quiere desactivar todos los?',
      of: 'los',
      back: 'Volver',
      manage: 'Gestionar',
      name: 'Nombre',
      edit: 'Editar',
      search: 'Busque en',
      save: 'Guardar',
      delete: 'Borrar',
      deleteChannel: '¿Realmente quieres borrar este canal?',
      addChanne: 'Añadir canal',
      infoButtonText: 'más información sobre esta fuente',
      addChatplugin: 'Añade Airy Live Chat a tu sitio web y aplicación',
      displayName: 'Nombre de la pantalla',
      addDisplayName: 'Añadir un nombre',
      imageUrl: 'URL de la imagen',
      imageUrlPlaceholder: '(opcionalmente) añadir una url de imagen',
      imageUrlHint: 'PNG de 1024x1024 píxeles como máximo',

      //Customize Chatplugin
      addCodeTagHead: 'Añade este código dentro de la etiqueta ',
      copyCode: 'Copiar código',
      headTextColor: 'Color del texto de la cabecera',
      subtitleTextColor: 'Color del texto de los subtítulos',
      primaryColor: 'Color primario',
      accentColor: 'Color de acento',
      backgroundColor: 'Color de fondo',
      inboundBackgroundColor: 'Color de fondo de entrada',
      inboundTextColor: 'Color del texto entrante',
      outboundBackgroundColor: 'Color de fondo de salida',
      outboundTextColor: 'Color del texto de salida',
      unreadMessageDotColor: 'Color de los puntos de los mensajes no leídos',
      headerText: 'Texto de cabecera',
      addTextOptional: '(opcionalmente) añadir un texto',
      subtitleText: 'Texto del subtítulo',
      startNewConversationText: 'Iniciar una nueva conversación Texto',
      chatpluginIconUrl: 'Icono del chat URL',
      inputIconUrl: 'Icono de entrada URL',
      customHostUrl: 'URL de alojamiento personalizada',
      addImageurlOptional: '(opcionalmente) añadir una url de imagen',
      heightPx: 'Altura (mínimo 200px)',
      customHeightPlaceholder: '(opcionalmente) añadir una altura personalizada',
      widthPx: 'Ancho (mínimo 200px)',
      customWidthPlaceholder: '(opcionalmente) añadir una anchura personalizada',
      disabledForMobile: 'Desactivado para el móvil',
      hideInputbar: 'Ocultar la barra de entrada',
      disableEmojis: 'Desactivar los emojis',
      useCustomFont: 'Utilizar fuentes personalizadas',
      closingOptions: 'Opciones de cierre',
      bubbleStateOptions: 'Opciones del estado de burbuja',
      supportedFileTypes: 'Tipos de archivo admitidos:',
      disableImages: 'Desactivar imágenes',
      disableVideos: 'Desactivar vídeos',
      disableFiles: 'Desactivar archivos',
      customFont: 'Fuente personalizada: ',
      update: 'Actualización',
      addAName: 'Añadir un nombre',
      settings: 'Ajustes',
      installCustomize: 'Instalar & personalizar',
      addLiveChatToWebsite: 'Añade Airy Live Chat a tu sitio web y aplicación',
      facebookPageId: 'ID de la página de Facebook',
      facebookPageIdPlaceholder: 'Añade el ID de la página de Facebook',
      token: 'Token',
      tokenPlaceholder: 'Añada el token de acceso a la página',
      nameOptional: 'Nombre (opcional)',
      nameFacebookPlaceholder: 'El nombre estándar será el mismo que el de la página de Facebook',
      imageUrlOptional: 'URL de la imagen (opcional)',
      addAnUrl: 'Añadir una URL',
      imageFacebookHint: 'La imagen estándar es la misma que la de la página de Facebook',
      connectPage: 'Conectar la página',
      updatePage: 'Actualización de la página',
      errorMessage: 'Por favor, compruebe el valor introducido',

      //Facebook Messenger

      connectMessenger: 'Conectar con Messenger',
      facebookConfiguration: 'La fuente de Facebook requiere la siguiente configuración:',
      facebookConfigurationText:
        'Se necesita un id y un token secreto de la aplicación para que la plataforma pueda enviar mensajes a través de tu aplicación de Facebook',
      facebookConfigurationText2:
        'Una integración de webhooks para que la plataforma pueda ingerir mensajes de tus páginas de Facebook',
      facebookConfigurationText3: 'Un token de página para cada página de Facebook que desee integrar',
      facebookConfigurationText4: `Compruebe la documentación de Airy`,
      facebookConfigurationText5: 'para más información.',

      //Google Business Messages

      agentId: 'Identificación del agente',
      googleAgentPlaceholder: 'Añade el ID de agente proporcionado por tu Google Partner',
      connectGoogle: 'Conectar los mensajes de Google Business',
      googleConfigurationText:
        'La fuente de mensajes de empresa de Google requiere la siguiente configuración para enviar mensajes a tu instancia de Airy Core:',
      googleAccountKey: 'Una clave de cuenta de servicio de Google',
      googleKey: 'Una clave de socio de Google',
      googleConfigurationText2: `Compruebe la documentación de Airy`,
      googleConfigurationText3: 'para más información.',

      //Instagram

      instagramAccount: 'ID de la página de Facebook conectada a la cuenta de Instagram',
      instagramAccountPlaceholder: 'Añade el ID de la página de Facebook',
      instagramAccountId: 'ID de la cuenta de Instagram',
      instagramAccountIdPlaceholder: 'Añade el ID de la cuenta de Instagram',
      connectInstagram: 'Conectar Instagram',
      instagramConfigurationText: 'La fuente de Instagram requiere la siguiente configuración:',
      instagramConfigurationText2:
        'Un identificador y un secreto de la aplicación para que la plataforma pueda devolver los mensajes a través de tu aplicación de Instagram',
      instagramConfigurationText3:
        'Una integración de webhook para que la plataforma pueda ingerir mensajes de tus páginas de Instagram',
      instagramConfigurationText4: 'Un token de página para cada página de Facebook que desee integrar',
      instagramConfigurationText5: `Compruebe la documentación de Airy`,
      instagramConfigurationText6: 'para más información.',

      //Twilio

      twilioPhoneNumber: 'Número de teléfono de Twilio',
      twilioPhoneNumberPlaceholder: 'Número de compra +123456789',
      connectSmsNumber: 'Conectar número Sms',
      updateSmsNumber: 'Actualizar el número de Sms',

      connectWhatsapp: 'Conectar con Whatsapp',
      connectWithTwilio: 'Conéctese primero con Twilio',
      twilioConfigurationText: 'Antes de conectar un número para SMS o Whatsapp, debes añadir un',
      twilioConfigurationText2: 'Twilio Auth Token',
      twilioConfigurationText3: 'a la',
      twilioConfigurationText4: 'airy.yaml',
      twilioConfigurationText5: 'archivo.',
      twilioConfigurationText6: 'Después, tienes que comprar un número.',
      twilioConfigurationText7: 'Consulte',
      twilioConfigurationText8: `Compruebe la documentación de Airy`,
      twilioConfigurationText9: 'para más información.',
      connectWhatsappNumber: 'Conectar el número de Whatsapp',
      updateWhatsappNumber: 'Actualizar el número de Whatsapp',

      //Connectors

      noResults: 'Resultado no encontrado.',
      noResultsTerm: 'Intente buscar un término diferente.',
      noConnectorsFound: 'No se han encontrado conectores',
      noConnectorsFoundTerm: 'No tiene ningún conector instalado, por favor abra el',
      noConnectorsFoundMore: 'y explorar más.',
      installed: 'Instalado(s)',
      notInstalled: 'No Instalado(s)',

      //NotFound

      notFound: '¡Uy! No pudimos encontrarlo aquí.',

      //Status

      status: 'Estatus',
      componentName: 'Nombre del componente',
      healthStatus: 'Estado de salud',
      enabled: 'Activado',

      //Webhooks

      errorOccurred: 'Se ha producido un error',
      successfullySubscribed: '¡Suscrito con éxito!',
      subscribeWebhook: 'Suscripción de Webhook',
      updateWebhook: 'Actualizar el Webhook',
      unsubscribeWebhook: 'Anular la suscripción del Webhook',
      unsubscribeWebhookText: '¿está seguro de que ',
      unsubscribeWebhookText2: ' quiere darse de baja?',
      unableToUnsubscribeWebhook: 'No se puede dar de baja el Webhook',
      subscribeCapital: 'Suscribirse',
      updateCapital: 'Actualización',
      subscribing: 'Suscribirse...',
      updating: 'Actualizar...',
      webhookCapslock: 'WEBHOOK',
      allEvents: 'TODOS LOS EVENTOS',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: window.navigator.language,
  fallbackLng: 'en',
});

export default i18n;
