FROM openjdk:19-jdk-alpine3.16

LABEL maintainer "https://github.com/airyhq"
LABEL name="kafka" version=${INSTALL_KAFKA_VERSION}

ENV INSTALL_KAFKA_VERSION 3.3.1
ENV INSTALL_SCALA_VERSION 2.13
ENV INSTALL_MIRROR="https://downloads.apache.org/"

RUN apk update \
    apk upgrade \
    && apk add -t .build-deps curl ca-certificates coreutils su-exec bash \
    && mkdir -p /opt \
    && curl -sSL "${INSTALL_MIRROR}kafka/${INSTALL_KAFKA_VERSION}/kafka_${INSTALL_SCALA_VERSION}-${INSTALL_KAFKA_VERSION}.tgz" \
       | tar -xzf - -C /opt \
    && mv /opt/kafka_${INSTALL_SCALA_VERSION}-${INSTALL_KAFKA_VERSION} /opt/kafka \
    && adduser -DH -s /sbin/nologin kafka \
    && chown -R kafka: /opt/kafka \
    && rm -rf /tmp/*

ENV PATH /sbin:/opt/kafka/bin/:$PATH

WORKDIR /opt/kafka

COPY config/server.properties /etc/kafka/server.properties
COPY /scripts/configure-kafka.sh /root/configure-kafka.sh
COPY /scripts/entrypoint.sh /root/entrypoint.sh

ENTRYPOINT ["/root/entrypoint.sh"]
