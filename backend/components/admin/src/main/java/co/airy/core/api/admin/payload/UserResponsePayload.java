package co.airy.core.api.admin.payload;

import co.airy.avro.communication.User;
import lombok.Builder;
import lombok.Data;

import static co.airy.date.format.DateFormat.isoFromMillis;

@Data
@Builder
public class UserResponsePayload {
    private String id;
    private String name;
    private String avatarUrl;
    private String firstSeenAt;
    private String lastSeenAt;

    public static UserResponsePayload fromUser(User user) {
        return UserResponsePayload.builder()
                .id(user.getId())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .firstSeenAt(isoFromMillis(user.getFirstSeenAt()))
                .lastSeenAt(isoFromMillis(user.getLastSeenAt()))
                .build();
    }
}
