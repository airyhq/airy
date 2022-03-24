package co.airy.model.metadata;

import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ValueType;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.model.metadata.dto.MetadataNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
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

import static java.util.Comparator.comparing;

public class MetadataObjectMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static JsonNode getMetadataPayload(MetadataMap metadataMap) {
        final List<Metadata> metadataList = new ArrayList<>(metadataMap.values());
        return getMetadataPayload(metadataList);
    }

    public static JsonNode getMetadataPayload(List<Metadata> metadataList) {
        metadataList.sort(comparing(Metadata::getTimestamp));

        final ObjectNode root = JsonNodeFactory.instance.objectNode();
        for (Metadata metadata : metadataList) {
            applyMetadata(root, new MetadataNode(metadata.getKey(), metadata.getValue(), metadata.getValueType()));
        }

        return root;
    }

    private static void applyMetadata(ObjectNode root, MetadataNode node) {
        final String[] nodeNames = node.getKey().split("\\.");

        // stop recursion
        if (nodeNames.length == 1) {
            setValue(root, node);
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
            node.setKey(remainingNodes);
            applyMetadata(nextRootNode, node);
        }
    }

    private static void setValue(ObjectNode node, MetadataNode metadataNode) {
        if (metadataNode.getValueType().equals(ValueType.text)) {
            node.put(metadataNode.getKey(), metadataNode.getValue());
        } else if(metadataNode.getValueType().equals(ValueType.number)) {
            node.put(metadataNode.getKey(), Double.parseDouble(metadataNode.getValue()));
        } else if(metadataNode.getValueType().equals(ValueType.nullValue)) {
            node.set(metadataNode.getKey(), objectMapper.nullNode());
        } else if(metadataNode.getValueType().equals(ValueType.bool)) {
            node.put(metadataNode.getKey(), Boolean.valueOf(metadataNode.getValue()));
        } else {
            try {
                node.set(metadataNode.getKey(), objectMapper.readTree(metadataNode.getValue()));
                return;
            } catch (Exception expected) {
            }
        }
    }

    public static List<Metadata> getMetadataFromJson(Subject subject, JsonNode payload) throws Exception {
        return getMetadataFromJson(subject, payload, "");
    }

    // Assembles a list of metadata values for a given subject from a JSON payload
    // The prefix path must end with a dot or be empty
    // Example:
    // {
    //   "foo": {
    //     "bar": "bar"
    //   }
    //   "baz": "baz"
    // }
    // -> <"foo.bar","bar">, <"baz","baz">
    public static List<Metadata> getMetadataFromJson(Subject subject, JsonNode payload, String prefixPath) throws Exception {
        final Instant creationTime = Instant.now();

        return getKeyValuePairs(payload, prefixPath)
                .stream()
                .map((keyValuePair ->
                        Metadata.newBuilder()
                                .setSubject(subject.toString())
                                .setKey(keyValuePair.getKey())
                                .setValue(keyValuePair.getValue())
                                .setValueType(keyValuePair.getValueType())
                                .setTimestamp(creationTime.toEpochMilli())
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
                results.add(new KeyValuePair(currentPath, node.textValue(), ValueType.text));
            } else if (node.isBoolean()) {
                results.add(new KeyValuePair(currentPath, node.asText(), ValueType.bool));
            } else if (node.isNumber()) {
                results.add(new KeyValuePair(currentPath, node.asText(), ValueType.number));
            } else if (node.isNull()) {
                results.add(new KeyValuePair(currentPath, "null", ValueType.nullValue));
            } else if (node.isArray()) {
                results.add(new KeyValuePair(currentPath, node.toString(), ValueType.array));
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
        private ValueType valueType;
    }
}
