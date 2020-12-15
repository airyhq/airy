package co.airy.mapping;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(classes = AirySpringBootApplication.class)
public class ContentMapperTest {

    @SpyBean
    private OutboundMapper outboundMapper;

    @Autowired
    private ContentMapper mapper;

    @Test
    void rendersOutbound() throws Exception {
        final String text = "Hello World";
        final Message message = Message.newBuilder()
                .setId("other-message-id")
                .setSource("facebook")
                .setSentAt(Instant.now().toEpochMilli())
                .setSenderId("sourceConversationId")
                .setSenderType(SenderType.APP_USER)
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("conversationId")
                .setChannelId("channelId")
                .setContent("{\"text\":\"" + text + "\"}")
                .build();

        final Text textMessage = (Text) mapper.render(message);

        assertThat(textMessage.getText(), equalTo(text));
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
}
