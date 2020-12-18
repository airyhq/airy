package co.airy.mapping;

import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import co.airy.mapping.sources.facebook.FacebookMapper;
import org.junit.jupiter.api.Test;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class FacebookTest {

    private final FacebookMapper mapper = new FacebookMapper();

    @Test
    void textMessage() throws Exception {
        final String text = "Hello world";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/text.json"), StandardCharsets.UTF_8), text);

        final Text message = (Text) mapper.render(sourceContent).get(0);

        assertThat(message.getText(), equalTo(text));
    }

    @Test
    void canRenderImages() throws Exception {
        final String imageUrl = "https://url-from-facebook.com/123-id";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/image.json"), StandardCharsets.UTF_8), imageUrl);

        final List<Content> contents = mapper.render(sourceContent);
        final Image image = (Image) contents.get(0);
        assertThat(image.getUrl(), equalTo(imageUrl));
    }
}
