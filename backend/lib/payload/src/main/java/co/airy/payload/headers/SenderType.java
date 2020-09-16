package co.airy.payload.headers;

public enum SenderType {
    SOURCE_CONTACT("SOURCE_CONTACT"),
    SOURCE_USER("SOURCE_USER"),
    APP_USER("APP_USER");

    private final String type;

    SenderType(String type) {
        this.type = type;
    }

    public String getType() {
        return this.type;
    }

    public boolean isSource() {
        return this == SOURCE_CONTACT || this == SOURCE_USER;
    }
}

