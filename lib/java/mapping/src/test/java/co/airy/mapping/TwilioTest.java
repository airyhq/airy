package co.airy.mapping;

import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import co.airy.mapping.sources.twilio.TwilioMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class TwilioTest {
    private final TwilioMapper mapper = new TwilioMapper();

    @Test
    void canRenderText() {
        final String body = "Hello World";

        String event = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received" +
                "&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                "&From=whatsapp%3A%2B&MessageSid=SMbc31b6419de618d65076200c54676476" +
                "&Body=" + body + "&AccountSid=AC64c9ab479b849275b7b50bd19540c602&NumMedia=0";

        final Text message = (Text) mapper.render(event).get(0);
        assertThat(message.getText(), equalTo(body));
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
        final Image image = (Image) message.stream().filter(c -> c instanceof Image).findFirst().get();
        assertThat(image.getUrl(), is(imageUrl));
    }
}
