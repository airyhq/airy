package co.airy.uuid;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;

public class UUIDv5Test {

    @Test
    void uuidFromString() {
        assertThat(UUIDv5.fromNamespaceAndName("test", "test").toString(),equalTo("51abb963-6078-5efb-b888-d8457a7c76f8"));
        assertThat(UUIDv5.fromNamespaceAndName("source", "98ce13ef-5469-4db3-af62-579be61cfaa4").toString(),equalTo("e5fc97f1-2f2d-53c5-85c7-97a83b17e9ff"));
        assertThat(UUIDv5.fromNamespaceAndName("source", "98ce13ef-5469-4db3-af62-579be61cfaa4".repeat(1_000_000)).toString(),equalTo("2c2ab940-6393-5349-bd87-bb236a541827"));
    }

    @Test
    void uuidFromFile() throws Exception {
        assertThat(UUIDv5.fromFile(new ByteArrayInputStream(("testtest").getBytes())).toString(), equalTo("51abb963-6078-5efb-b888-d8457a7c76f8"));
        assertThat(UUIDv5.fromFile(new ByteArrayInputStream(("source98ce13ef-5469-4db3-af62-579be61cfaa4").getBytes())).toString(), equalTo("e5fc97f1-2f2d-53c5-85c7-97a83b17e9ff"));
    }


    @Test
    void inputStreamIsReset() throws Exception {
        final String testString = "source" + "98ce13ef-5469-4db3-af62-579be61cfaa4".repeat(1_000_000);
        final ByteArrayInputStream inputStream = new ByteArrayInputStream(testString.getBytes());
        assertThat(UUIDv5.fromFile(inputStream).toString(), equalTo("2c2ab940-6393-5349-bd87-bb236a541827"));

        final byte[] bytes = inputStream.readAllBytes();
        assertThat(new String(bytes, StandardCharsets.UTF_8), equalTo(testString));
    }
}
