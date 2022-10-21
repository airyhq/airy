package co.airy.core.ibm_watson_assistant.models;


import co.airy.core.ibm_watson_assistant.models.MessageSend;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.String;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)

public class MessageSend {
    private String sessionId;
    private String assistantId;
    private JsonNode input;
}
