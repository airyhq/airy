package co.airy.mapping;

import co.airy.mapping.model.Content;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OutboundMapper {

    private final ObjectMapper objectMapper;

    public OutboundMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public List<Content> render(String payload) throws Exception {
        final Content content = objectMapper.readValue(payload, Content.class);
        return List.of(content);
    }
}
