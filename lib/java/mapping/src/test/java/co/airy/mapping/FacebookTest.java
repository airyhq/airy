package co.airy.mapping;

import co.airy.mapping.model.Audio;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.File;
import co.airy.mapping.model.SourceTemplate;
import co.airy.mapping.model.Video;
import co.airy.mapping.sources.facebook.FacebookMapper;
import org.junit.jupiter.api.Test;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.isA;

public class FacebookTest {

    private final FacebookMapper mapper = new FacebookMapper();

    @Test
    void textMessage() throws Exception {
        final String text = "Hello world";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/text.json"), StandardCharsets.UTF_8), text);

        final List<Content> contents = mapper.render(sourceContent);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(hasProperty("text", equalTo(text))));
    }

    @Test
    void canRenderImages() throws Exception {
        final String imageUrl = "https://url-from-facebook.com/123-id";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/image.json"), StandardCharsets.UTF_8), imageUrl);

        final List<Content> contents = mapper.render(sourceContent);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(hasProperty("url", equalTo(imageUrl))));
    }

    @Test
    void canRenderAudio() throws Exception {
        final String audioUrl = "https://url-from-facebook-cdn.com/123-id.mp4";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/audio.json"), StandardCharsets.UTF_8), audioUrl);

        final List<Content> contents = mapper.render(sourceContent);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(isA(Audio.class)));
        assertThat(contents, everyItem(hasProperty("url", equalTo(audioUrl))));
    }

    @Test
    void canRenderVideo() throws Exception {
        final String videoUrl = "https://video.xx.fbcdn.net/v/t42.3356-2/10000000_3670351823059679_8252233555063215828_n.mp4/video-1608240605.mp4?_nc_cat=110&ccb=2&_nc_sid=060d78&_nc_ohc=o7KPshTGwGwAX9xsWIT&vabr=1741655&_nc_ht=video.xx&oh=76581365554981fa6e343c3b2fa65aef&oe=5FDD193B";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/video.json"), StandardCharsets.UTF_8), videoUrl);

        final List<Content> contents = mapper.render(sourceContent);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(isA(Video.class)));
        assertThat(contents, everyItem(hasProperty("url", equalTo(videoUrl))));
    }

    @Test
    void canRenderFile() throws Exception {
        final String fileUrl = "https://cdn.fbsbx.com/v/t59.2708-21/file_identifier.pdf/file_name.pdf";
        final String sourceContent = String.format(StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("facebook/file.json"), StandardCharsets.UTF_8), fileUrl);

        final List<Content> contents = mapper.render(sourceContent);
        assertThat(contents, hasSize(1));
        assertThat(contents, everyItem(isA(File.class)));
        assertThat(contents, everyItem(hasProperty("url", equalTo(fileUrl))));
    }

    @Test
    void canRenderTemplates() throws Exception {
        final List<String> templateTypes = List.of("generic");

        for (String templateType : templateTypes) {
            final String content = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream(String.format("facebook/template_%s.json", templateType)), StandardCharsets.UTF_8);
            final List<Content> contents = mapper.render(content);
            assertThat(contents, hasSize(1));
            assertThat(contents, everyItem(isA(SourceTemplate.class)));
        }
    }
}
