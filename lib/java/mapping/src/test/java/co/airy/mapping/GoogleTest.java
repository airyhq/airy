package co.airy.mapping;

import co.airy.mapping.model.Image;
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

        final Text message = (Text) mapper.render(content).get(0);
        assertThat(message.getText(), equalTo("Yes confirmed"));
    }

    @Test
    void canRenderImage() throws Exception {
        final String signedImageUrl = "https://storage.googleapis.com/business-messages-us/936640919331/jzsu6cdguNGsBhmGJGuLs1DS?x-goog-algorithm\u003dGOOG4-RSA-SHA256\u0026x-goog-credential\u003duranium%40rcs-uranium.iam.gserviceaccount.com%2F20190826%2Fauto%2Fstorage%2Fgoog4_request\u0026x-goog-date\u003d20190826T201038Z\u0026x-goog-expires\u003d604800\u0026x-goog-signedheaders\u003dhost\u0026x-goog-signature\u003d89dbf7a74d21ab42ad25be071b37840a544a43d68e67270382054e1442d375b0b53d15496dbba12896b9d88a6501cac03b5cfca45d789da3e0cae75b050a89d8f54c1ffb27e467bd6ba1d146b7d42e30504c295c5c372a46e44728f554ba74b7b99bd9c6d3ed45f18588ed1b04522af1a47330cff73a711a6a8c65bb15e3289f480486f6695127e1014727cac949e284a7f74afd8220840159c589d48dddef1cc97b248dfc34802570448242eac4d7190b1b10a008404a330b4ff6f9656fa84e87f9a18ab59dc9b91e54ad11ffdc0ad1dc9d1ccc7855c0d263d93fce6f999971ec79879f922b582cf3bb196a1fedc3eefa226bb412e49af7dfd91cc072608e98";
        final String content = "{\n" +
                "  \"agent\": \"brands/BRAND_ID/agents/AGENT_ID\",\n" +
                "  \"conversationId\": \"CONVERSATION_ID\",\n" +
                "  \"customAgentId\": \"CUSTOM_AGENT_ID\",\n" +
                "  \"requestId\": \"REQUEST_ID\",\n" +
                "  \"message\": {\n" +
                "    \"messageId\": \"MESSAGE_ID\",\n" +
                "    \"name\": \"conversations/CONVERSATION_ID/messages/MESSAGE_ID\",\n" +
                "    \"text\": \"" + signedImageUrl + "\",\n" +
                "    \"createTime\": \"MESSAGE_CREATE_TIME\"\n" +
                "  },\n" +
                "  \"context\": {},\n" +
                "  \"sendTime\": \"2020-05-14T12:45:55.302Z\",\n" +
                "  \"conversationId\": \"9cec28cc-8dbe-40d0-ad68-edd0f440c743\",\n" +
                "  \"customAgentId\": \"5b43b04d-aa75-4b7b-bdca-28e90a344db1\",\n" +
                "  \"requestId\": \"3A25E132-20D6-4A5D-8602-7DF4979F181B\",\n" +
                "  \"agent\": \"brands/af0ef816-cef8-479e-b4b6-650d5e8b90b1/agents/31a8d3e0-490f-4ecc-887b-42df4dd1952e\"\n" +
                "}\n";

        final Image message = (Image) mapper.render(content).get(0);
        assertThat(message.getUrl(), equalTo(signedImageUrl));
    }
}
