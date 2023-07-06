package co.airy.core.sources.whatsapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEntry {
    // Whatsapp business account id
    private String id;
    private List<Change> changes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Change {
        private Value value;
        private String field;

        public Value getValue() {
            if (value == null) return null;

            if (value.getWhatsappBusinessApiData() != null) {
                return value.getWhatsappBusinessApiData();
            }

            return value;
        }
    }
}

