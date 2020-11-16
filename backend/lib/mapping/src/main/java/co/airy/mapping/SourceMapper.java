package co.airy.mapping;

import co.airy.mapping.model.Content;

public interface SourceMapper {
    String getIdentifier();

    Content render(String payload) throws Exception;
}
