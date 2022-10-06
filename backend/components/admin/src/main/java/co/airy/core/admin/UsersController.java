package co.airy.core.admin;

import co.airy.avro.communication.User;
import co.airy.core.admin.payload.ListUsersResponsePayload;
import co.airy.core.admin.payload.PaginationData;
import co.airy.core.admin.payload.UserResponsePayload;
import co.airy.core.admin.payload.UsersListRequestPayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class UsersController {
    private final Stores stores;

    public UsersController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/users.list")
    public ResponseEntity<?> list(@RequestBody(required = false) @Valid UsersListRequestPayload payload) {
        payload = payload == null ? new UsersListRequestPayload() : payload;

        final List<User> users = stores.getUsers();
        Paginator<User> paginator = new Paginator<>(users, User::getId)
                .perPage(payload.getPageSize()).from(payload.getCursor());

        Page<User> page = paginator.page();

        return ResponseEntity.ok(ListUsersResponsePayload.builder()
                .data(page.getData().stream().map(UserResponsePayload::fromUser).collect(toList()))
                .paginationData(PaginationData.builder()
                        .nextCursor(page.getNextCursor())
                        .previousCursor(page.getPreviousCursor())
                        .total(users.size())
                        .build()).build());
    }

}
