---
title: Contacts
sidebar_label: Contacts
---

import TLDR from "@site/src/components/TLDR";

<TLDR>

Want to tie conversations across messaging channels to a single contact? Airy allows you to do that and then sync
these contacts to your existing CRM solutions.

</TLDR>

:::note

This feature is disabled by default. To enable it you need to set the `integration.source-api.enabled` field in your [airy.yaml config](getting-started/installation/configuration.md) to `true`.

:::

Enabling the contacts component allows for this typical flow:

- For every existing conversation we automatically create a contact that references the conversation
- Contacts can then also be manually created, updated, fetched and importantly: merged

See the [create contact response payload](#create-contact) for an example of what the schema looks like.

### Create contact

`POST /contacts.create`

**Sample request**

All request fields are optional, but an empty payload will not be accepted.

```json5
{
  "display_name": "Barabara Liskov",
  "avatar_url": "https://example.org/avatar.jpg",
  "title": "Professor",
  "timezone": "", // relative to GMT
  "gender": "female", // female, male or any other value
  "locale": "en_US",
  "organization_name": "Massachusetts Institute of Technology",
  "via": {
    "phone": "+1234567",
    "email": "b.liskov@mit.org",
    "key": "value" // allows for any additional key and value (arrays are prohibited)
  },
  "address": {
    "organization_name": "Massachusetts Institute of Technology",
    "address_line1": "77 Massachusetts Ave",
    "address_line2": "building A",
    "postcode": "02139",
    "city": "Cambridge",
    "state": "MA",
    "country": "USA"
  },
  "conversations": {
    // Automatically created contacts will always have a single conversation that is linked here
    "ea1cba21-2bd6-477c-9a40-59cd9bb96bef": "facebook",
    "8904adee-38b4-493b-a4d8-272e2e5a6815": "twilio.sms"
  },
  "metadata": {
    "facebook": {
      "psid": "1234567890",
      "page_id": "9876543210"
    },
    "salesforce_id": "ABC123",
    "zendesk_id": "XYZ789",
    "key": "value" // allows for any additional key and value (arrays are prohibited)
  }
}
```

**(201) Success Response Payload**

import ContactResponsePayload from './../sources/applyVariables-note.mdx'

<ContactResponsePayload />

### Import contacts
`POST /contacts.import`

Creates contacts in a bulk.

**Sample request**
```json5
[
  {
    "display_name": "Barabara Liskov",
    "avatar_url": "https://example.org/avatar.jpg",
    "title": "Professor",
  },
  {
    "display_name": "Eleanor B. Garcia",
    "avatar_url": "https://example.org/avatar.jpg",
    "title": "Estimator project manager",
  },
  {
    "display_name": "Marie R. Lemelin",
    "avatar_url": "https://example.org/avatar.jpg",
    "title": "Accountant",
  },
  {
    "display_name": "Lori L. Carter",
    "avatar_url": "https://example.org/avatar.jpg",
    "title": "Occupational health and safety technician",
  },
]
```

**(201) Success Response Payload**
```json5
{
  "data": [
    {
      "display_name": "Barabara Liskov",
      "avatar_url": "https://example.org/avatar.jpg",
      "title": "Professor",
    },
    {
      "display_name": "Eleanor B. Garcia",
      "avatar_url": "https://example.org/avatar.jpg",
      "title": "Estimator project manager",
    },
    {
      "display_name": "Marie R. Lemelin",
      "avatar_url": "https://example.org/avatar.jpg",
      "title": "Accountant",
    },
    {
      "display_name": "Lori L. Carter",
      "avatar_url": "https://example.org/avatar.jpg",
      "title": "Occupational health and safety technician",
    }
  ],
  "pagination_data": {
    "previous_cursor": "",
    "next_cursor": "",
    "total": 1
  }
}
```

### List contacts

`POST /contacts.list`

This is a [paginated](api/endpoints/introduction.md#pagination) endpoint.

**Sample request**

```json5
{
  "cursor": "next-page-uuid",
  "page_size": 2
}
```

**Sample response**

```json5
{
  "data": [
    {
      "id": "6b80b10c-ae6e-4995-844d-c56c4da11623",
      "display_name": "Barabara Liskov",
      "title": "Professor",
      "created_at": "2021-11-16T13:21:03.580Z"
    },
    {
      "id": "c564cea4-a96f-4ebb-a220-3fb81b6ad522",
      "display_name": "Grace Hopper",
      "created_at": "2021-11-16T13:45:52.433Z"
    }
  ],
  "pagination_data": {
    "previous_cursor": null,
    "next_cursor": "2",
    "total": 200
  }
}
```

### Get contact

Get a single contact by contact or conversation id.

`POST /contacts.info`

**Sample request by contact id**

```json5
{
  "id": "6b80b10c-ae6e-4995-844d-c56c4da11623"
}
```

**Sample request by conversation id**

```json5
{
  "conversation_id": "ea1cba21-2bd6-477c-9a40-59cd9bb96bef"
}
```

**Sample response**

<ContactResponsePayload />

### Update contact

`POST /contacts.update`

All fields set on the [creation request](#create-contact) can be updated. To remove a field set it to the empty string `""`.

**Sample request**

```json5
{
  "id": "6b80b10c-ae6e-4995-844d-c56c4da11623",
  "display_name": "Barbara Liskov" //
}
```

**Sample response 202 (Accepted)**

### Merge contacts

If you are sure two conversations belong to the same contact you can either:

1. Call this endpoint if there are already contacts for both
2. Update the either contact if the other does not exist
3. Create a fresh contact if neither exist.

Calling this endpoint will cause the source contact to be deleted. However, calls to `/contacts.info` and `/contacts.update` will continue to be forwarded to the target contact.

**Sample request**

```json5
{
  "source_contact": "6b80b10c-ae6e-4995-844d-c56c4da11623", // merge contact with this id
  "target_contact": "c564cea4-a96f-4ebb-a220-3fb81b6ad522" // into contact with this id
}
```

**Sample response**

<ContactResponsePayload />

### Delete contact

**Sample request**

```json5
{
  "id": "6b80b10c-ae6e-4995-844d-c56c4da11623"
}
```

**(202) Sample response**
