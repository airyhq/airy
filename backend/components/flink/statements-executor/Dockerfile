# Use the official Golang image as the base image
FROM golang:1.17

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source code into the container
COPY ./src/*.go ./

# Install the required libraries
RUN go mod init main && \
    go get github.com/confluentinc/confluent-kafka-go/v2/kafka && \
    go get github.com/confluentinc/confluent-kafka-go/v2/schemaregistry && \
    go get github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde && \
    go get github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde/avro && \
    go get golang.org/x/net

# Build the Go program
RUN go build -o app

# Command to run the Go program
CMD ["./app"]
