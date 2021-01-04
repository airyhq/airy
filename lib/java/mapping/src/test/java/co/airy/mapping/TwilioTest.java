package co.airy.mapping;

import co.airy.mapping.model.Audio;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import co.airy.mapping.sources.twilio.TwilioMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Every.everyItem;
import static org.hamcrest.core.Is.isA;

public class TwilioTest {
    private final TwilioMapper mapper = new TwilioMapper();

    @Test
    void canRenderText() {
        final String body = "Hello World";

        String event = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received" +
                "&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                "&From=whatsapp%3A%2B&MessageSid=SMbc31b6419de618d65076200c54676476" +
                "&Body=" + body + "&AccountSid=AC64c9ab479b849275b7b50bd19540c602&NumMedia=0";

        final List<Content> contents = mapper.render(event);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(hasProperty("text", equalTo(body))));
    }

    @Test
    void canRenderImage() throws Exception {
        final String body = "Heres a picture of an owl!";
        final String imageUrl = "https://demo.twilio.com/owl.png";

        String event = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received" +
                "&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                "&From=whatsapp%3A%2B&MessageSid=SMbc31b6419de618d65076200c54676476" +
                "&Body=" + body + "&AccountSid=AC64c9ab479b849275b7b50bd19540c602&NumMedia=0" +
                "&MediaUrl=" + imageUrl;

        final List<Content> message = mapper.render(event);
        assertThat(message, hasItem(isA(Text.class)));
        assertThat(message, hasItem(isA(Image.class)));
        assertThat(message, hasItem(hasProperty("url", equalTo(imageUrl))));
    }

    @Test
    void canRenderAudio() throws Exception {
        final String audioUrl = "https://demo.twilio.com/owl.mp3";

        String event = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received" +
                "&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                "&From=whatsapp%3A%2B&MessageSid=SMbc31b6419de618d65076200c54676476" +
                "&MediaUrl=" + audioUrl;
        final List<Content> message = mapper.render(event);

        assertThat(message, everyItem(isA(Audio.class)));
        assertThat(message, everyItem(hasProperty("url", equalTo(audioUrl))));
    }
}
