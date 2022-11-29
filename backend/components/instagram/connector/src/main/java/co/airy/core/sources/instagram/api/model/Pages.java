package co.airy.core.sources.instagram.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pages {
    private List<PageWithConnectInfo> data;
    private Paging paging;

    @Data
    public static class Paging {
        private String next;
    }
}

