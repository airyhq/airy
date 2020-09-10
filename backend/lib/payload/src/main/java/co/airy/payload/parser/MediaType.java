package backend.lib.payload.src.main.java.co.airy.payload.parser;

public enum MediaType {
    PLAIN("text/plain"),
    FB_GENERIC("text/fb-template"),
    FB_CAROUSELL("text/fb-template+carousell"),
    FB_LIST("text/fb-template+list"),
    FB_FEEDBACK("text/fb-template+feedback"),
    FB_BUTTON("text/fb-template+button"),
    IMAGE_PNG("image/png"),
    IMAGE_JPG("image/jpg"),
    IMAGE_JPEG("image/jpeg"),
    IMAGE_GIF("image/gif"),
    ERROR("application/vnd.airy.error+json");

    private String value;

    MediaType(String value) {
        this.value = value;
    }

    public String value() {
        return this.value;
    }
}
