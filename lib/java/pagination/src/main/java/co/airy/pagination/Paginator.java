package co.airy.pagination;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.function.Function;

public class Paginator<T> {
    private final List<T> list;
    private final Function<T, String> id;
    private Integer perPage = 10;
    private String cursor;

    public Paginator(List<T> list, Function<T, String> id) {
        this.list = list;
        this.id = id;
    }

    public Paginator<T> perPage(Integer perPage) {
        if (perPage != null && perPage > 0) {
            this.perPage = perPage;
        }
        return this;
    }

    public Paginator<T> from(String cursor) {
        this.cursor = cursor;
        return this;
    }

    public Page<T> page() {
        if (list.isEmpty()) {
            return new Page<>();
        }

        boolean cursorPresent = cursor != null && !cursor.trim().isEmpty();
        int total = list.size();

        String toFind = cursorPresent ? cursor : id.apply(list.get(0));

        int startPageIndex = 0;
        int endPageIndex = total;

        if (total > perPage) {
            while (startPageIndex < total && !id.apply(list.get(startPageIndex)).equals(toFind)) {
                startPageIndex++;
            }
            if (startPageIndex == total) {
                throw new NoSuchElementException(toFind);
            }
            endPageIndex = Math.min(total, startPageIndex + perPage);
        }

        Page<T> page = new Page<>();
        page.setData(list.subList(startPageIndex, endPageIndex));

        if (startPageIndex - perPage >= 0) {
            page.setPreviousCursor(id.apply(list.get(startPageIndex - perPage)));
        }

        if (endPageIndex < total) {
            page.setNextCursor(id.apply(list.get(endPageIndex)));
        }

        return page;
    }
}
