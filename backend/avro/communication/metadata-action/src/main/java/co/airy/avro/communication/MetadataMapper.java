package co.airy.avro.communication;

import java.util.Map;

import static java.util.stream.Collectors.toMap;

public class MetadataMapper {
    public static Map<String, String> filterPrefix(Map<String, String> metadataMap, String prefix) {
        return metadataMap
                .entrySet()
                .stream()
                .filter((entry) -> entry.getKey().startsWith(prefix))
                .collect(toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
