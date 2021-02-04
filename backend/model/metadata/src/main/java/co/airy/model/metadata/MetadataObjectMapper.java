package co.airy.model.metadata;

import co.airy.avro.communication.Metadata;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Arrays;
import java.util.List;

import static java.util.Comparator.comparing;

public class MetadataObjectMapper {
    public static JsonNode getMetadataPayload(List<Metadata> metadataList) {
        metadataList.sort(comparing(metadata -> ((Metadata) metadata).getTimestamp()));

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
            final JsonNode existingNode = root.get(nodeName);
            if (existingNode != null && existingNode.isObject()) {
                nextRootNode = (ObjectNode) existingNode;
            } else {
                nextRootNode = JsonNodeFactory.instance.objectNode();
            }

            applyMetadata(nextRootNode, remainingNodes, value);
            root.set(nodeName, nextRootNode);
        }
    }
}
