package co.airy.core.api.components.installer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import co.airy.log.AiryLoggerFactory;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.ops.OpsApplicationComponents;
import lombok.Synchronized;

import static co.airy.model.metadata.MetadataRepository.getId;

@Component
public class Stores implements HealthIndicator {

    private static final Logger log = AiryLoggerFactory.getLogger(Stores.class);

    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final String opsApplicationComponents = new OpsApplicationComponents().name();

    private Map<String, String> prevoiusCacheMap = new HashMap<>();

    public Stores(KafkaProducer<String, SpecificRecordBase> producer) {
        this.producer = producer;
    }

    public void storeComponent(List<Metadata> metadataList) throws Exception {
        for (Metadata metadata : metadataList) {
            producer.send(new ProducerRecord<>(
                        opsApplicationComponents,
                        getId(metadata).toString(), metadata)).get();
        }
    }

    @Synchronized
    public void storeFromCacheMap(Map<String, String> cacheStore) throws Exception {
        log.info(prevoiusCacheMap.toString());
        log.info(cacheStore.toString());
        final List<Metadata> cacheChanges = cacheStore
            .entrySet()
            .stream()
            .filter(e -> !prevoiusCacheMap.getOrDefault(e.getKey(), "").equals(e.getValue()))
            .map(e -> co.airy.model.component.Component
                    .builder()
                    .componentName(e.getKey())
                    .installationStatus(e.getValue())
                    .build())
            .map(c -> c.toMetadata())
            .flatMap(List::stream)
            .collect(Collectors.toList());

        log.info(cacheChanges.toString());
        //storeComponent(cacheChanges);
        prevoiusCacheMap = cacheStore;
    }

    @Override
    public Health health() {
        return Health.up().build();
    }
}
