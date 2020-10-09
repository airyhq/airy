package co.airy.core.api.auth.dao;

import co.airy.core.api.auth.dto.User;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Component;

@Component
public interface UserDAO {

    @SqlUpdate("INSERT INTO users(id) values (:id)")
    @RegisterBeanMapper(User.class)
    void insert(@BindBean User user);
}
