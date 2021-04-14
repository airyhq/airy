package co.airy.mapping;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.mapping.model.Audio;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Text;
import co.airy.spring.core.AirySpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.startsWith;

@SpringBootTest(classes = AirySpringBootApplication.class)
public class ContentMapperTest {

    @SpyBean
    private OutboundMapper outboundMapper;

    @Autowired
    private ContentMapper mapper;

    @Test
    void rendersOutbound() throws Exception {
        final String textContent = "Hello World";
        final Text text = new Text(textContent);

        final Message message = Message.newBuilder()
                .setId("other-message-id")
                .setSource("facebook")
                .setSentAt(Instant.now().toEpochMilli())
                .setSenderId("sourceConversationId")
                .setIsFromContact(false)
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("conversationId")
                .setChannelId("channelId")
                .setContent((new ObjectMapper()).writeValueAsString(text))
                .build();

        final Text textMessage = (Text) mapper.render(message).get(0);

        assertThat(textMessage.getText(), equalTo(textContent));
        Mockito.verify(outboundMapper).render(Mockito.anyString());
    }

    @Test
    void includesTypeInformation() throws Exception {
        final String testText = "Hello world";
        final Text textContent = new Text(testText);
        final String value = (new ObjectMapper()).writeValueAsString(textContent);

        final JsonNode jsonNode = (new ObjectMapper()).readTree(value);

        assertThat(jsonNode.get("type").textValue(), equalTo("text"));
        assertThat(jsonNode.get("text").textValue(), equalTo(testText));
    }


    @Test
    void replacesDataUrls() throws Exception {
        final String originalUrl = "http://example.org/path/sound.wav";

        final Message message = Message.newBuilder()
                .setId("messageId")
                .setSource("fakesource")
                .setSentAt(Instant.now().toEpochMilli())
                .setSenderId("sourceConversationId")
                .setIsFromContact(true)
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("conversationId")
                .setChannelId("channelId")
                .setContent("{\"audio\":\"" + originalUrl + "\"}")
                .build();

        final ContentMapper mapper = new ContentMapper(List.of(new SourceMapper() {
            @Override
            public List<String> getIdentifiers() {
                return List.of("fakesource");
            }

            @Override
            public List<Content> render(String payload) {
                return List.of(new Audio(originalUrl));
            }
        }), outboundMapper);

        // No replacement without metadata
        Audio audioMessage = (Audio) mapper.render(message).get(0);
        assertThat(audioMessage.getUrl(), equalTo(originalUrl));

        final String persistentUrl = "http://storage.org/path/data";
        final Map<String, String> messageMetadata = Map.of("data_" + originalUrl, persistentUrl);

        audioMessage = (Audio) mapper.render(message, messageMetadata).get(0);
        assertThat(audioMessage.getUrl(), equalTo(persistentUrl));
    }

}
