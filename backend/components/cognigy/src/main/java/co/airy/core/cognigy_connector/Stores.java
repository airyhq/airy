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

//Kafka streams: java lib that streams records to and from Kafka 

//event streams: series or sequences of key value pairs 
//which are independent of each other 

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

        //StreamsBuilder provide the high-level Kafka Streams DSL to specify a Kafka Streams topology.
        //define kafka stream topology using streams builder class:
        //- create an instance of this stream builder class
        //the StreamsBuilder class is used to construct the design of the topology
        final StreamsBuilder builder = new StreamsBuilder();

        
        final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
        final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

        //Construct a stream from the input topic (new ApplicationCommunicationMessages().name())
        //the builder.stream is going to just take in an input topic (new ApplicationCommunicationMessages().name())
        //which is just the name of the topic that you want to stream these events from 

        //and a consumed configuration object (= key and the value of the record)
        //---> Consumed.with(Topology.AutoOffsetReset.LATEST)
        //Topology is a directed acyclic graph of stream processing nodes that represents 
        //the stream processing logic of a Kafka Streams application.

        //tells streams what to do and what you want these events to be processed with

        //filter:
        //call the filter operator and specify what you are filtering 
        ///filter defines which events should be filtered out of the event stream 
        //and which one should be kept 

        //a filter creates a new event stream with only those events which you care about 

        //in the filter you have access to the key and the value 
        //and you define a predicate on these values 
        //and return just a true or false whether or not you want to keep them 

        //MAPPING:
        //Transform events by chaining together one or more transformations
        //flatMap() method first flattens the input 
        //as a performance optimization, prefer flatMapValues over flatMap?

        //to function: specifying a destination topic 
       //Transformed events are streamed as the output of the topology
       // using the to function specifying a destination topic 
       //as well as the serializers required to encode the data.

       //topology defined within the builder
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
       //builder.build() --> returns an instance of the created Topology 
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
