package co.airy.mapping;

import co.airy.mapping.model.Text;
import co.airy.mapping.sources.facebook.FacebookMapper;
import org.junit.jupiter.api.Test;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class FacebookTest {

    private final FacebookMapper mapper = new FacebookMapper();

    @Test
    void textMessage() throws Exception {
        final String text = "Hello world";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/text.json"), StandardCharsets.UTF_8), text);

        final Text message = (Text) mapper.render(sourceContent);

        assertThat(message.getText(), equalTo(text));
    }
}
