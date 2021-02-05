package co.airy.model.metadata;

import co.airy.avro.communication.Metadata;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        final List<Metadata> metadata = new ArrayList<>(Arrays.asList(
                newConversationMetadata("id", "contact.address.line_1", "Mission Street"),
                newConversationMetadata("id", "contact.displayName", "Grace"),
                newConversationMetadata("id", "tags.1234", "")
        ));

        final JsonNode payload = getMetadataPayload(metadata);
        assertThat(payload.get("contact").get("address").get("line_1").textValue(), equalTo("Mission Street"));
        assertThat(payload.get("contact").get("displayName").textValue(), equalTo("Grace"));
        assertThat(payload.get("tags").get("1234").textValue(), equalTo(""));
    }

    @Test
    void canResolveConflictsByTime() {
        final Metadata oldMetadata = newConversationMetadata("id", "contact.address.line_1", "Mission Street");
        final Metadata newMetadata = newConversationMetadata("id", "contact.address", "Anklamer Str.");
        newMetadata.setTimestamp(oldMetadata.getTimestamp() + 1000);

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
                "    \"address\": {" +
                "      \"line_1\": \"Mission Street\"" +
                "    }" +
                "  }," +
                "  \"tags\": {" +
                "    \"1234\": \"\"" +
                "  }" +
                "}";
        final JsonNode node = new ObjectMapper().readTree(updateJson);

        final List<Metadata> metadataList = getMetadataFromJson(new Subject("conversation", "id"), node);

        assertThat(metadataList, hasSize(3));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.displayName") && metadata.getValue().equals("Grace")
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("contact.address.line_1") && metadata.getValue().equals("Mission Street")
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals("tags.1234") && metadata.getValue().equals("")
        )));
    }
}
