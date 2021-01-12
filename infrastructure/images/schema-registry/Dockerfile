FROM python:3.9-slim-buster as builder

RUN apt-get update && apt-get install -y make gcc git

WORKDIR /wheels

COPY requirements.txt .

RUN pip3 wheel -r requirements.txt

FROM python:3.9-slim-buster

LABEL maintainer "https://github.com/airyhq"

LABEL name="schema-registry" version=${SCHEMA_REGISTRY_VERSION}

ARG SCHEMA_REGISTRY_VERSION
ENV SCHEMA_REGISTRY_VERSION=$SCHEMA_REGISTRY_VERSION

COPY --from=builder /wheels /wheels

RUN apt-get update && apt-get install -y git

RUN pip install --no-cache-dir \
                       -r /wheels/requirements.txt \
                       -f /wheels \
        && rm -rf /wheels

ADD ${SCHEMA_REGISTRY_VERSION}.egg .

RUN easy_install ${SCHEMA_REGISTRY_VERSION}.egg

ADD config.json .

CMD karapace config.json
