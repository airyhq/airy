package co.airy.mapping.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Text.class, name = "text"),
        @JsonSubTypes.Type(value = Audio.class, name = "audio"),
        @JsonSubTypes.Type(value = File.class, name = "file"),
        @JsonSubTypes.Type(value = Image.class, name = "image"),
        @JsonSubTypes.Type(value = Video.class, name = "video"),
        @JsonSubTypes.Type(value = SourceTemplate.class, name = "source.template")
})
public abstract class Content {
}
