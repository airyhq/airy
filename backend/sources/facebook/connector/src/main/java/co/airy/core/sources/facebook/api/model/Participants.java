package co.airy.core.sources.facebook.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participants {
    private List<Entry> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Entry {
        private Participant participants;
        private String id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Participant {
        private List<ParticipantEntry> data;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantEntry {
        private String name;
        private String email;
        private String id;
    }
}
