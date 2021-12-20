package co.airy.core.media.services;


import co.airy.core.media.services.MediaUpload;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class MediaUploadTest {
    @MockBean
    private AmazonS3 amazonS3Client;

    @Test
    void connectionStatusOK() throws Exception {
        final List<Bucket> emptyList = Collections.emptyList();
        doReturn(emptyList).when(amazonS3Client).listBuckets();

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(true));
    }

    @Test
    void connectionStatusNotOK() throws Exception {
        doReturn(null).when(amazonS3Client).listBuckets();

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(false));
    }

    @Test
    void connectionStatusException() throws Exception {
        doThrow(SdkClientException.class).when(amazonS3Client).listBuckets();

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(false));
    }
}
