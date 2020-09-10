package backend.lib.payload.src.main.java.co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TemplateElementPayload implements Serializable {

    public String title;

    public String subtitle;

    public String imageUrl;

    public String defaultAction;

    public Boolean externalAttachment;

    public String mediaType; //Used in case template type is 'media' - values are [image, video]

    public String url; //Used in case template type is 'media'

    public List<TemplateElementButtonPayload> buttons;

    public Long quantity;

    public Double price;

}
