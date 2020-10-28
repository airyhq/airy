package co.airy.core.api.admin.sources.facebook;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class FacebookApi {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://graph.facebook.com/v3.2";
    private final String SUBSCRIBED_FIELDS = "affiliation,attire,awards,bio,birthday,category,checkins,company_overview,culinary_team,current_location,description,email,feed,founded,general_info,general_manager,hometown";

    @Value("${facebook.app-id}")
    private String fbAppId;
    @Value("${facebook.app-secret}")
    private String fbApiSecret;

    @Autowired
    private ObjectMapper objectMapper;

    private final String pageFields = "fields=id,name_with_location_descriptor,access_token,picture,is_webhooks_subscribed";

    public List<FbPageWithConnectInfo> getAllPagesForUser(String accessToken) throws Exception {
        String pagesUrl = String.format(baseUrl + "/me/accounts?%s&access_token=%s", pageFields, accessToken);

        boolean paginated = true;
        List<FbPageWithConnectInfo> pageList = new ArrayList<>();
        while (paginated) {
            FbPages fbPages = apiResponse(pagesUrl, HttpMethod.GET, FbPages.class);
            if (fbPages.getPaging() != null && fbPages.getPaging().getNext() != null) {
                pagesUrl = URLDecoder.decode(fbPages.getPaging().getNext(), StandardCharsets.UTF_8);
            } else {
                paginated = false;
            }
            pageList.addAll(fbPages.getData());
        }
        return pageList;
    }

    public FbPageWithConnectInfo getPageForUser(final String pageId, final String accessToken) throws Exception {
        final String pageUrl = String.format(baseUrl + "/%s?%s&access_token=%s", pageId, pageFields, accessToken);

        return apiResponse(pageUrl, HttpMethod.GET, FbPageWithConnectInfo.class);
    }

    public void connectPageToApp(String pageToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/me/subscribed_apps?access_token=%s&subscribed_fields=%s", pageToken, SUBSCRIBED_FIELDS);
        apiResponse(apiUrl, HttpMethod.POST, Map.class);
    }

    public String exchangeToLongLivingUserAccessToken(String userAccessToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s", fbAppId, fbApiSecret, userAccessToken);
        return apiResponse(apiUrl, HttpMethod.GET, FbLongLivingUserAccessToken.class).getAccessToken();
    }


    private <T> T apiResponse(String url, HttpMethod method, Class<T> clazz) throws Exception {
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, method, null, String.class);

        return objectMapper.readValue(responseEntity.getBody(), clazz);
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class FbPages {
    private List<FbPageWithConnectInfo> data;
    private Paging paging;

    @Data
    static class Paging {
        private String next;
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class FbLongLivingUserAccessToken {
    private String accessToken;
}

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class FbApiError {
    private String message;
    private String type;
    private Integer code;
}
