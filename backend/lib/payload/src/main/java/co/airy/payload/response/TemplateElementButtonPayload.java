package co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TemplateElementButtonPayload implements Serializable {

    public String type;

    public String title;

    public String url;

    public String fallbackUrl;

    public String payload;

    public boolean messengerExtensions;
}
