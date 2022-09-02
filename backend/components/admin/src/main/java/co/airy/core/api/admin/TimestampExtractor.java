package co.airy.core.api.admin;

import co.airy.avro.ops.HttpLog;
import co.airy.core.api.admin.dto.LogWithTimestamp;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Transformer;
import org.apache.kafka.streams.kstream.TransformerSupplier;
import org.apache.kafka.streams.processor.ProcessorContext;

public class TimestampExtractor {
    public static TransformerSupplier<String, HttpLog, KeyValue<String, LogWithTimestamp>> timestampExtractor() {
        return new TransformerSupplier<>() {
            @Override
            public Transformer<String, HttpLog, KeyValue<String, LogWithTimestamp>> get() {
                return new Transformer<>() {

                    private ProcessorContext context;

                    @Override
                    public void init(ProcessorContext processorContext) {
                        this.context = processorContext;
                    }

                    @Override
                    public KeyValue<String, LogWithTimestamp> transform(String logId, HttpLog log) {
                        return KeyValue.pair(logId, new LogWithTimestamp(context.timestamp(), log));
                    }

                    @Override
                    public void close() {
                    }
                };
            }
        };
    }
}
