package co.airy.core.media.services;


import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class MediaUploadTest {
    @MockBean
    private AmazonS3 amazonS3Client;

    @Test
    void connectionStatusOk() throws Exception {
        final ListObjectsV2Result bucketObjects = new ListObjectsV2Result();
        doReturn(bucketObjects).when(amazonS3Client).listObjectsV2(any(ListObjectsV2Request.class));

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(true));

        ArgumentCaptor<ListObjectsV2Request> arg = ArgumentCaptor.forClass(ListObjectsV2Request.class);
        verify(amazonS3Client).listObjectsV2(arg.capture());
        assertThat(arg.getValue().getBucketName(), equalTo("my-bucket"));
        assertThat(arg.getValue().getPrefix(), equalTo("my/path/"));
        assertThat(arg.getValue().getMaxKeys(), equalTo(1));
    }

    @Test
    void connectionStatusNotOk() throws Exception {
        doReturn(null).when(amazonS3Client).listObjectsV2(any(ListObjectsV2Request.class));

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(false));
    }

    @Test
    void connectionStatusException() throws Exception {
        doThrow(SdkClientException.class).when(amazonS3Client).listObjectsV2(any(ListObjectsV2Request.class));

        final MediaUpload m = new MediaUpload(amazonS3Client, "my-bucket", "my/path");
        assertThat(m.isConnectionStatus(), equalTo(false));
    }
}
