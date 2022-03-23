package co.airy.model.metadata;

import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ValueType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static co.airy.model.metadata.MetadataObjectMapper.getMetadataFromJson;
import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ObjectMapperTest {

    @Test
    void canCreateJsonPayload() {
        final Metadata metadata1 = newConversationMetadata("id", "contact.address.line_1", "Mission Street");
        final Metadata metadata2 = newConversationMetadata("id", "contact.displayName", "Grace");
        final Metadata metadata3 = newConversationMetadata("id", "tags", "{\"foo\":[\"bar\"]}");
        metadata3.setValueType(ValueType.object);
        final Metadata metadata4 = newConversationMetadata("id", "unread", "10");
        metadata4.setValueType(ValueType.number);
        final Metadata metadata5 = newConversationMetadata("id", "sizes", "[5,\"XL\"]");
        metadata5.setValueType(ValueType.array);
        final Metadata metadata6 = newConversationMetadata("id", "friends", "null");
        metadata6.setValueType(ValueType.nullValue);

        final JsonNode payload = getMetadataPayload(new ArrayList<>(List.of(metadata1, metadata2, metadata3, metadata4, metadata5, metadata6)));
        assertThat(payload.get("contact").get("address").get("line_1").textValue(), equalTo("Mission Street"));
        assertThat(payload.get("contact").get("displayName").textValue(), equalTo("Grace"));
        assertThat(payload.get("tags").get("foo").get(0).textValue(), equalTo("bar"));
        assertThat(payload.get("unread").intValue(), equalTo(10));
        assertThat(payload.get("sizes").get(0).intValue(), equalTo(5));
        assertThat(payload.get("sizes").get(1).textValue(), equalTo("XL"));
        assertTrue(payload.get("friends").isNull());
    }

    @Test
    void canResolveConflictsByTime() {
        final Metadata oldMetadata = newConversationMetadata("id", "contact.address.line_1", "Mission Street");
        final Metadata newMetadata = newConversationMetadata("id", "contact.address", "Anklamer Str.");
        newMetadata.setTimestamp(oldMetadata.getTimestamp().plus(Duration.ofSeconds(1)));

        // Purposefully switching the list order
        final List<Metadata> metadata = new ArrayList<>(Arrays.asList(
                newMetadata,
                oldMetadata
        ));

        final JsonNode payload = getMetadataPayload(metadata);
        assertThat(payload.get("contact").get("address").isTextual(), equalTo(true));
        assertThat(payload.get("contact").get("address").textValue(), equalTo("Anklamer Str."));
    }

    @Test
    void canMapObjectToMetadata() throws Exception {
        final String updateJson = "{" +
                "  \"contact\": {" +
                "    \"displayName\": \"Grace\"," +
                "    \"age\":42," +
                "    \"is_happy\":true," +
                "    \"friends\":null," +
                "    \"address\": {" +
                "      \"line_1\": \"Mission Street\"" +
                "    }" +
                "  }," +
                "  \"tags\":[1,2,\"3\"]" +
                "}";
        final JsonNode node = new ObjectMapper().readTree(updateJson);

        final List<Metadata> metadataList = getMetadataFromJson(new Subject("conversation", "id"), node);

        assertThat(metadataList, hasSize(6));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.displayName") && metadata.getValue().equals("Grace")
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.address.line_1") && metadata.getValue().equals("Mission Street")
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.age") && metadata.getValue().equals("42") && metadata.getValueType().equals(ValueType.number)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.is_happy") && metadata.getValue().equals("true") && metadata.getValueType().equals(ValueType.bool)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.friends") && metadata.getValue().equals("null") && metadata.getValueType().equals(ValueType.nullValue)
        )));
    }
}
