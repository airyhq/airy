package co.airy.pagination;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.IntStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.text.IsEmptyString.emptyOrNullString;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PaginatorTest {
    private static final List<Thing> things = new ArrayList<>();

    @BeforeAll
    static void beforeAll() {
        IntStream.rangeClosed(1, 33).forEachOrdered(i -> things.add(new Thing(Integer.toString(i))));
    }

    @Test
    void returnsTheRightPage() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(5).from("15");

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(5));
        assertThat(page.getPreviousCursor(), is("10"));
        assertThat(page.getNextCursor(), is("20"));
    }

    @Test
    void returnsNoPreviousCursorForFirstPage() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(10);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(10));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), is("11"));
    }

    @Test
    void returnsNoNextCursorForLastPage() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(10).from("30");

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(4));
        assertThat(page.getPreviousCursor(), is("20"));
        assertThat(page.getNextCursor(), emptyOrNullString());
    }

    @Test
    void canNavigateTillEnd() {
        String start = null;
        Page<Thing> page = new Paginator<>(things, Thing::getId).perPage(10).from(start).page();

        int actualPages = 1;

        while (page.getNextCursor() != null) {
            page = new Paginator<>(things, Thing::getId).perPage(10).from(page.getNextCursor()).page();
            actualPages++;
        }

        assertThat(actualPages, is(4));
    }

    @Test
    void canNavigateTillStart() {
        Page<Thing> page = new Paginator<>(things, Thing::getId).perPage(10).from("31").page();

        int actualPages = 1;

        while (page.getPreviousCursor() != null) {
            page = new Paginator<>(things, Thing::getId).perPage(10).from(page.getPreviousCursor()).page();
            actualPages++;
        }

        assertThat(actualPages, is(4));
    }

    @Test
    void canHandleNonExistingCursor() {
        assertThrows(NoSuchElementException.class,
                () -> new Paginator<>(things, Thing::getId).perPage(10).from("101").page());
    }

    @Test
    void canHandlePerPageLargerThanInput() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(200);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(33));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), emptyOrNullString());
    }

    @Test
    void canHandleEmptyInput() {
        Paginator<Thing> paginator = new Paginator<>(new ArrayList<>(), Thing::getId);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(0));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), emptyOrNullString());
    }

    @Test
    void defaultsTo10PerPageIfNullInputPerPage() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(null);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(10));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), is("11"));
    }

    @Test
    void defaultsTo10PerPageIf0InputPerPage() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).perPage(0);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(10));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), is("11"));
    }

    @Test
    void defaultsToNoCursorIfNullInputCursor() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).from(null);

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(10));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), is("11"));
    }

    @Test
    void defaultsToNoCursorIfEmptyInputCursor() {
        Paginator<Thing> paginator = new Paginator<>(things, Thing::getId).from("");

        Page<Thing> page = paginator.page();

        assertThat(page.getData(), hasSize(10));
        assertThat(page.getPreviousCursor(), emptyOrNullString());
        assertThat(page.getNextCursor(), is("11"));
    }
}

class Thing {
    private final String id;

    Thing(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}

