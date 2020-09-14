package co.airy.kafka.schema;

import java.util.Map;

public interface Topic {
    String name();
    String kind();
    String domain();
    String dataset();

    Map<String, String> config();
}

