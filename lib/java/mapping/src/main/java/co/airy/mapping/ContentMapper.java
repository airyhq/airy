package co.airy.mapping;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.log.AiryLoggerFactory;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.DataUrl;
import co.airy.mapping.model.Text;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ContentMapper {
    private final Logger log = AiryLoggerFactory.getLogger(ContentMapper.class);
    private final Map<String, SourceMapper> mappers = new HashMap<>();
    private final OutboundMapper outboundMapper;

    public ContentMapper(List<SourceMapper> sourceMappers,
                         OutboundMapper outboundMapper) {
        for (SourceMapper mapper : sourceMappers) {
            mapper.getIdentifiers().forEach((identifier) -> mappers.put(identifier, mapper));
        }
        this.outboundMapper = outboundMapper;
    }

    public List<Content> render(Message message) throws Exception {
        return render(message, Map.of());
    }

    public List<Content> render(Message message, Map<String, String> metadata) throws Exception {
        if (SenderType.APP_USER.equals(message.getSenderType()) || "chat_plugin".equals(message.getSource())) {
            return outboundMapper.render(message.getContent());
        }

        final SourceMapper sourceMapper = mappers.get(message.getSource());
        if (sourceMapper == null) {
            throw new Exception("can not map message source " + message.getSource());
        }

        final List<Content> contentList = sourceMapper.render(message.getContent());

        /*
         * Source content can contain data urls that expire. Therefore we upload this data
         * to a user provided storage and dynamically replace the urls here in the mapper
         */
        for (Content content : contentList) {
            // Replace the url if the metadata contains a key "data_{source url}"
            if (content instanceof DataUrl) {
                final String dataKey = String.format("data_%s", ((DataUrl) content).getUrl());
                final String persistentUrl = metadata.get(dataKey);

                if (persistentUrl != null) {
                    ((DataUrl) content).setUrl(persistentUrl);
                }
            }
        }

        return contentList;
    }

    public List<Content> renderWithDefaultAndLog(Message message) {
        return renderWithDefaultAndLog(message, Map.of());
    }

    public List<Content> renderWithDefaultAndLog(Message message, Map<String, String> metadata) {
        try {
            return this.render(message, metadata);
        } catch (Exception e) {
            log.error("Failed to render message {}", message, e);
            return List.of(new Text("This content cannot be displayed"));
        }
    }
}
