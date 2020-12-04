package co.airy.mapping;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.log.AiryLoggerFactory;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Text;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ContentMapper {
    private final Logger log = AiryLoggerFactory.getLogger(ContentMapper.class);
    private final Map<String, SourceMapper> mappers = new HashMap<>();
    private final OutboundMapper outboundMapper;

    public ContentMapper(List<SourceMapper> sourceMappers, OutboundMapper outboundMapper) {
        for (SourceMapper mapper : sourceMappers) {
            mapper.getIdentifiers().forEach((identifier) -> {
                mappers.put(identifier, mapper);
            });
        }
        this.outboundMapper = outboundMapper;
    }

    public Content render(Message message) throws Exception {
        if (SenderType.APP_USER.equals(message.getSenderType()) || "chat_plugin".equals(message.getSource())) {
            return outboundMapper.render(message.getContent());
        }

        final SourceMapper sourceMapper = mappers.get(message.getSource());
        if (sourceMapper == null) {
            throw new Exception("can not map message source " + message.getSource());
        }

        return sourceMapper.render(message.getContent());
    }

    public Content renderWithDefaultAndLog(Message message) {
        try {
            return this.render(message);
        } catch (Exception e) {
            log.error("Failed to render message {}", message, e);
            return new Text("This content cannot be displayed");
        }
    }
}
