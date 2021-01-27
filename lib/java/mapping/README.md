# Mapping library

This library is responsible for mapping source ingestion message content
strings to a payload structure that can be sent via network APIs.

## Motivation

We learned that the safest way of handling ingestion message data from
`n` sources with up to `m` content schemata each is to keep the data "as is"
and map the content to a usable schema dynamically.

This gives us the ability to address mapping bugs by fixing code (cheap)
rather than fixing streaming data (expensive).
