package co.airy.mapping;

import co.airy.mapping.model.Text;
import co.airy.mapping.sources.google.GoogleMapper;
import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class GoogleTest {
    private final GoogleMapper mapper = new GoogleMapper();

    @Test
    void canRenderText() throws Exception {
        final String content = "{\n" +
                "  \"message\": {\n" +
                "    \"name\": \"conversations/9cec28cc-8dbe-40d0-ad68-edd0f440c743/messages/3A25E132-20D6-4A5D-8602-7DF4979F181B\",\n" +
                "    \"text\": \"Yes confirmed\",\n" +
                "    \"createTime\": \"2020-05-14T12:45:54.531828Z\",\n" +
                "    \"messageId\": \"3A25E132-20D6-4A5D-8602-7DF4979F181B\"\n" +
                "  },\n" +
                "  \"context\": {},\n" +
                "  \"sendTime\": \"2020-05-14T12:45:55.302Z\",\n" +
                "  \"conversationId\": \"9cec28cc-8dbe-40d0-ad68-edd0f440c743\",\n" +
                "  \"customAgentId\": \"5b43b04d-aa75-4b7b-bdca-28e90a344db1\",\n" +
                "  \"requestId\": \"3A25E132-20D6-4A5D-8602-7DF4979F181B\",\n" +
                "  \"agent\": \"brands/af0ef816-cef8-479e-b4b6-650d5e8b90b1/agents/31a8d3e0-490f-4ecc-887b-42df4dd1952e\"\n" +
                "}";

        final Text message = (Text) mapper.render(content);
        assertThat(message.getText(), equalTo("Yes confirmed"));
    }
}
