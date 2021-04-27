---
title: Overview
sidebar_label: Overview
---

The grouping of HTTP endpoints reflects the high-level entities of the [Airy
Core Data Model](getting-started/glossary.md).

## Conventions

All HTTP endpoints adhere to the following conventions:

- Endpoints only accept `POST` JSON requests.
- We use dots for namespacing URLs (eg `/things.add`).

## Pagination

By default, paginated endpoints return a maximum of 20 elements on the first page.

The size of the returned page can be controlled by the `page_size` field of the
body. You can move back and forth between pages using the `cursor` field of the
body.

Paginated endpoints _always_ respond with the following JSON format:

```json
{
  "data": [
    {
      "id": "a688d36c-a85e-44af-bc02-4248c2c97622",
      "field1": "answer is 42",
      "field2": "this is fine"
    }
  ],
  "pagination_data": {
    "previous_cursor": "",
    "next_cursor": "",
    "filtered_total": 1,
    "total": 1
  }
}
```

The response comes in two parts:

- `data`

  An array of objects. Object specification depends on the endpoint.

- `pagination_data`
  An object with the following fields:

  - `previous_cursor`

    The ID of first elements in the previous page of data. Empty if the returned
    page is the first one.

  - `next_cursor`

    The ID of first elements in the next page of data. Empty if the returned
    page is the last one.

  - `filtered_total`

    The total number of elements across pages in the context of the current
    filter selection. Only applicable to paginated endpoints that can filter
    data.

  - `total`

    The total number of elements across all pages.
