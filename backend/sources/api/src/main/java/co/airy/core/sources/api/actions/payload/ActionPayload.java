package co.airy.core.sources.api.actions.payload;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = SendMessageRequestPayload.class, name = "message.send"),
})
public abstract class ActionPayload {
}
