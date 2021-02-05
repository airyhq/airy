package co.airy.model.metadata;

import co.airy.avro.communication.Metadata;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Comparator.comparing;

public class MetadataObjectMapper {
    public static JsonNode getMetadataPayload(List<Metadata> metadataList) {
        metadataList.sort(comparing(Metadata::getTimestamp));

        final ObjectNode root = JsonNodeFactory.instance.objectNode();
        for (Metadata metadata : metadataList) {
            applyMetadata(root, metadata.getKey(), metadata.getValue());
        }

        return root;
    }

    private static void applyMetadata(ObjectNode root, String key, String value) {
        final String[] nodeNames = key.split("\\.");

        // stop recursion
        if (nodeNames.length == 1) {
            root.put(key, value);
        } else {
            final String nodeName = nodeNames[0];
            final String remainingNodes = String.join(".", Arrays.copyOfRange(nodeNames, 1, nodeNames.length));

            ObjectNode nextRootNode;
            // Check if there is an existing object node we can use
            // If the existing node is not an object we overwrite it
            final JsonNode existingNode = root.get(nodeName);
            if (existingNode != null && existingNode.isObject()) {
                nextRootNode = (ObjectNode) existingNode;
            } else {
                nextRootNode = JsonNodeFactory.instance.objectNode();
                root.set(nodeName, nextRootNode);
            }
            applyMetadata(nextRootNode, remainingNodes, value);

        }
    }

    public static List<Metadata> getMetadataFromJson(Subject subject, JsonNode payload) throws Exception {
        final long creationTime = Instant.now().toEpochMilli();

        return getKeyValuePairs(payload, "")
                .stream()
                .map((keyValuePair ->
                        Metadata.newBuilder()
                                .setSubject(subject.toString())
                                .setKey(keyValuePair.getKey())
                                .setValue(keyValuePair.getValue())
                                .setTimestamp(creationTime)
                                .build()
                )).collect(Collectors.toList());
    }

    private static List<KeyValuePair> getKeyValuePairs(JsonNode payload, String prefixPath) throws Exception {
        final Iterator<Map.Entry<String, JsonNode>> nodes = payload.fields();

        List<KeyValuePair> results = new ArrayList<>();
        while (nodes.hasNext()) {
            Map.Entry<String, JsonNode> entry = nodes.next();
            final JsonNode node = entry.getValue();

            // i.e. prefixPath = contacts. node key = displayName
            final String currentPath = prefixPath + entry.getKey();
            if (node.isTextual()) {
                results.add(new KeyValuePair(currentPath, node.textValue()));
            } else if (node.isObject()) {
                results.addAll(getKeyValuePairs(node, currentPath + "."));
            } else {
                throw new Exception(String.format("node \"%s\" needs to be of type String or Object (is: \"%s\")", entry.getKey(), node.getNodeType()));
            }
        }

        return results;
    }

    @Data
    @AllArgsConstructor
    private static class KeyValuePair {
        private String key;
        private String value;
    }
}
