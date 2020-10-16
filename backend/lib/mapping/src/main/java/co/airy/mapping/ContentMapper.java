package co.airy.mapping;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.mapping.model.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ContentMapper {
    private final Map<String, SourceMapper> mappers = new HashMap<>();
    private final OutboundMapper outboundMapper;

    public ContentMapper(@Autowired List<SourceMapper> sourceMappers, OutboundMapper outboundMapper) {
        for (SourceMapper mapper : sourceMappers) {
            mappers.put(mapper.getIdentifier(), mapper);
        }
        this.outboundMapper = outboundMapper;
    }

    public Content render(Message message) throws Exception {
        if (SenderType.APP_USER.equals(message.getSenderType())) {
            return outboundMapper.render(message.getContent());
        }

        final SourceMapper sourceMapper = mappers.get(message.getSource());
        if (sourceMapper == null) {
            throw new Exception("can not map message source " + message.getSource());
        }

        return sourceMapper.render(message.getContent());
    }
}
