package co.airy.pagination;

import java.util.ArrayList;
import java.util.List;

public class Page<T> {
    private List<T> data = new ArrayList<>();

    private String previousCursor;
    private String nextCursor;

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public String getPreviousCursor() {
        return previousCursor;
    }

    void setPreviousCursor(String previousCursor) {
        this.previousCursor = previousCursor;
    }

    public String getNextCursor() {
        return nextCursor;
    }

    void setNextCursor(String nextCursor) {
        this.nextCursor = nextCursor;
    }
}
