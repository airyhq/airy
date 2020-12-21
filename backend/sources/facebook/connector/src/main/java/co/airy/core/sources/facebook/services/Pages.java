package co.airy.core.sources.facebook.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
class Pages {
    private List<PageWithConnectInfo> data;
    private Paging paging;

    @Data
    static class Paging {
        private String next;
    }
}

