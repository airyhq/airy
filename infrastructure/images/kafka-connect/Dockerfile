FROM confluentinc/cp-kafka-connect:6.1.0

LABEL maintainer "https://github.com/airyhq"

USER root
RUN yum install unzip -y

ADD https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-s3/versions/10.0.0/confluentinc-kafka-connect-s3-10.0.0.zip /tmp/
RUN unzip /tmp/confluentinc-kafka-connect-s3-10.0.0.zip -d /usr/share/confluent-hub-components
