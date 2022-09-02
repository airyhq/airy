package co.airy.core.sources.twilio;

import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Transformer;
import org.apache.kafka.streams.kstream.TransformerSupplier;
import org.apache.kafka.streams.processor.ProcessorContext;

/*
 Twilio does not relay the send time so we extract the Kafka ingestion timestamp that is set
 when the message hits the webhook endpoint
*/
public class TimestampExtractor {
    public static TransformerSupplier<String, TwilioEventInfo, KeyValue<String, TwilioEventInfo>> timestampExtractor() {
        return new TransformerSupplier<>() {
            @Override
            public Transformer<String, TwilioEventInfo, KeyValue<String, TwilioEventInfo>> get() {
                return new Transformer<>() {

                    private ProcessorContext context;

                    @Override
                    public void init(ProcessorContext processorContext) {
                        this.context = processorContext;
                    }

                    @Override
                    public KeyValue<String, TwilioEventInfo> transform(String k, TwilioEventInfo v) {
                        v.setTimestamp(context.timestamp());

                        return KeyValue.pair(k, v);
                    }

                    @Override
                    public void close() {

                    }
                };
            }
        };
    }
}
