package co.airy.core.contacts;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.contacts.dto.Contact;
import co.airy.kafka.schema.application.ApplicationCommunicationContacts;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static co.airy.core.contacts.MetadataRepository.newContactMetadata;
import static co.airy.model.metadata.MetadataKeys.ConversationKeys.CONTACT;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isConversationMetadata;
import static java.util.stream.Collectors.toList;

@Component
public class Stores implements ApplicationListener<ApplicationReadyEvent>, DisposableBean, HealthIndicator {
    private static final String appId = "contacts.Stores";
    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final String contactsStore = "contacts-store";
    private final String conversationsStore = "conversations-store";
    private final String conversationToContactStore = "conversation-to-contact-map";
    private final String applicationCommunicationContacts = new ApplicationCommunicationContacts().name();

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecordBase> producer) {
        this.streams = streams;
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        final KTable<String, MetadataMap> conversationToContactTable = builder.<String, Metadata>table(applicationCommunicationContacts)
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                // Create Contact table
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor, Materialized.as(contactsStore))
                .toStream()
                // Create map of: conversation id -> contact metadatamap
                .flatMap((contactId, metadataMap) -> {
                    final Contact contact = Contact.fromMetadataMap(metadataMap);
                    if (contact == null || contact.getConversations() == null) {
                        return List.of();
                    }

                    return contact.getConversations().keySet().stream()
                            .map((conversationId) -> KeyValue.pair(conversationId.toString(), metadataMap)).collect(toList());
                })
                .toTable(Materialized.as(conversationToContactStore));

        // conversation metadata
        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .filter((metadataId, metadata) -> isConversationMetadata(metadata) && metadata.getKey().startsWith(CONTACT))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor);


        // 1. Auto create contacts if they don't exist
        // 2. Populate contact metadata with conversation metadata (if missing)
        builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .groupBy((messageId, message) -> message.getConversationId())
                .aggregate(Conversation::new,
                        (conversationId, message, aggregate) -> {
                            if (aggregate.getLastMessageContainer() == null) {
                                aggregate = Conversation.builder()
                                        .lastMessageContainer(MessageContainer.builder().message(message).build())
                                        .createdAt(message.getSentAt()) // Set this only once for the sent time of the first message
                                        .build();
                            }

                            // equals because messages can be updated
                            if (message.getSentAt() >= aggregate.getLastMessageContainer().getMessage().getSentAt()) {
                                aggregate.setLastMessageContainer(MessageContainer.builder().message(message).build());
                            }
                            return aggregate;
                        })
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    if (metadataMap != null) {
                        return conversation.toBuilder()
                                .metadataMap(metadataMap)
                                .build();
                    }
                    return conversation;
                }, Materialized.as(conversationsStore)).toStream()
                // Stream conversation contact data to existing contacts or create new ones
                .leftJoin(conversationToContactTable, (conversation, metadataMap) -> {
                    List<Metadata> metadata = new ArrayList<>();
                    final Contact contact = Contact.fromMetadataMap(metadataMap);
                    // Create contact
                    if (contact == null) {
                        final String contactId = UUID.randomUUID().toString();
                        metadata.add(newContactMetadata(contactId, Contact.MetadataKeys.DISPLAY_NAME, conversation.getDisplayNameOrDefault()));

                    } else {
                        // Update contact if necessary
                        if (contact.getDisplayName() == null) {
                            metadata.add(newContactMetadata(contact.getId(), Contact.MetadataKeys.DISPLAY_NAME, conversation.getDisplayNameOrDefault()));
                        }
                        conversation.getMetadataMap().getMetadataValue(MetadataKeys.ConversationKeys.Contact.AVATAR_URL);
                        if (contact.getAvatarUrl() == null) {
                            metadata.add(newContactMetadata(contact.getId(), Contact.MetadataKeys.AVATAR_URL, conversation.getDisplayNameOrDefault()));
                        }
                    }

                    return metadata;
                })
                .flatMap((conversationId, metadataList) -> metadataList.stream()
                        .map((metadata) -> KeyValue.pair(getId(metadata), metadata)).collect(toList()))
                .to(applicationCommunicationContacts);

        streams.start(builder.build(), appId);
    }

    private ReadOnlyKeyValueStore<String, MetadataMap> getContactStore() {
        return streams.acquireLocalStore(contactsStore);
    }

    private ReadOnlyKeyValueStore<String, Conversation> getConversationsStore() {
        return streams.acquireLocalStore(conversationsStore);
    }

    private ReadOnlyKeyValueStore<String, MetadataMap> getConversationToContactStore() {
        return streams.acquireLocalStore(conversationToContactStore);
    }

    public List<Contact> getAllContacts() {
        final ReadOnlyKeyValueStore<String, MetadataMap> store = getContactStore();
        final List<Contact> contacts = new ArrayList<>();
        store.all().forEachRemaining(entry -> contacts.add(Contact.fromMetadataMap(entry.value)));
        return contacts;
    }

    public Contact getContact(String contactId) {
        final ReadOnlyKeyValueStore<String, MetadataMap> store = getContactStore();
        return Contact.fromMetadataMap(store.get(contactId));
    }

    public Contact getContactByConversationId(String conversationId) {
        final ReadOnlyKeyValueStore<String, MetadataMap> store = getConversationToContactStore();
        final MetadataMap metadataMap = store.get(conversationId);
        return Contact.fromMetadataMap(metadataMap);
    }

    public void storeContact(List<Metadata> metadataList) throws Exception {
        for (Metadata metadata : metadataList) {
            producer.send(new ProducerRecord<>(applicationCommunicationContacts, getId(metadata).toString(),
                    // Interpret "" as a deletion
                    metadata.getValue().equals("") ? null : metadata)).get();
        }
    }

    @Override
    public Health health() {
        getContactStore();
        getConversationsStore();
        getConversationToContactStore();
        return Health.up().build();
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }
}
