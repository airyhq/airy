// Store - Class that gives you access to Kafka Store(s)
package co.airy.core.cognigy;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static co.airy.model.message.MessageRepository.isNewMessage;

//Kafka streams: java library used to write your own stream processing applications 
//it's an unrelated process that connects to the broker over the network 
//Kafka Streams is a standalone application that streams records to and from Kafka 

//event streams: series or sequences of key value pairs which are independent of each other 

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "cognigy-connector";
    private final KafkaStreamsWrapper streams;
    private  CognigyConnectorService  cognigyConnectorService;

    Stores(KafkaStreamsWrapper streams,  CognigyConnectorService  cognigyConnectorService) {
        this.streams = streams;
        this. cognigyConnectorService =  cognigyConnectorService;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event){

        //define kafka stream topology using streams builder class:
        //- create an instance of this stream builder class
        final StreamsBuilder builder = new StreamsBuilder();

        //-
        final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
        final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

        //the builder.stream is going to just take in an input topic 
        //which is just the name of the topic that you want to stream these events from 
        //and a consumed configuration object (= key and the value of the record)

        //tells streams what to do and what you want these events to be processed with

        //filter:
        //call the filter operator and specify what you are filtering 
        ///filter defines which events should be filtered out of the event stream 
        //and which one should be kept 

        //a filter creates a new event stream with only those events which you care about 

        //in the filter you have access to the key and the value 
        //and you define a predicate on these values 
        //and return just a true or false whether or not you want to keep them 

        //flatMap() method first flattens the input 

        //as a performance optimization, prefer mapValues over map?

        builder.<String, Message>stream(
                new ApplicationCommunicationMessages().name(),
                Consumed.with(Topology.AutoOffsetReset.LATEST)
        ).filter((messageId, message) -> message != null && isNewMessage(message) && message.getIsFromContact())
                .flatMap((messageId, message) ->  cognigyConnectorService.send(message))
                .to((recordId, record, context) -> {
                    if (record instanceof Metadata) {
                        return applicationCommunicationMetadata;
                    }
                    if (record instanceof Message) {
                        return applicationCommunicationMessages;
                    }

                    throw new IllegalStateException("Unknown type for record " + record);
                });

       //start stream, this creates a thread that is connected to kafka 
        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy(){
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        return Health.up().build();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
