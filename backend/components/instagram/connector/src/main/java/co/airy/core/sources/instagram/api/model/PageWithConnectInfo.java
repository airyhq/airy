package co.airy.core.sources.instagram.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PageWithConnectInfo {
    private String id;
    private String nameWithLocationDescriptor;
    private String accessToken;
    private PagePic picture;
    @JsonProperty("is_webhooks_subscribed")
    private boolean webhooksSubscribed;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PagePic {
        private PicData data;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PicData {
            private String url;
        }
    }
}
