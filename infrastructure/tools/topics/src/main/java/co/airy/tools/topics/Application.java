package co.airy.tools.topics;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.joining;

public class Application {

    public static void main(String[] args) {
        String createTopicTemplate = "    kafka-topics.sh --create --if-not-exists --zookeeper \"${ZOOKEEPER}\" --replication-factor \"${REPLICAS}\" --partitions \"${PARTITIONS}\" --topic \"${AIRY_CORE_NAMESPACE}%s\" %s";
        String headerTemplate = "apiVersion: v1" +
                "\n" +
                "kind: ConfigMap" +
                "\n" +
                "metadata:" +
                "\n" +
                "  name: kafka-create-topics" +
                "\n" +
                "  annotations:" +
                "\n" +
                "    \"helm.sh/hook\": \"pre-install, pre-upgrade\"" +
                "\n" +
                "    \"helm.sh/hook-weight\": \"2\"" +
                "\n" +
                "  namespace: {{ .Release.Namespace }}" +
                "\n" +
                "data:" +
                "\n" +
                "  create-topics.sh: |" +
                "\n" +
                "    #!/bin/bash\n" +
                "\n" +
                "    ##########################################################################\n" +
                "    # THIS FILE WAS GENERATED. DO NOT EDIT. See /infrastructure/tools/topics #\n" +
                "    ##########################################################################\n" +
                "\n" +
                "    set -euo pipefail\n" +
                "    IFS=$'\\n\\t'\n" +
                "\n" +
                "    ZOOKEEPER=${ZOOKEEPER:-zookeeper:2181}\n" +
                "    PARTITIONS=${PARTITIONS:-10}\n" +
                "    REPLICAS=${KAFKA_MINIMUM_REPLICAS:-1}\n" +
                "    AIRY_CORE_NAMESPACE=${AIRY_CORE_NAMESPACE:-}\n" +
                "\n" +
                "    echo \"Creating Kafka topics\"\n" +
                "\n" +
                "    if [ -n \"${AIRY_CORE_NAMESPACE}\" ]\n" +
                "    then\n" +
                "      AIRY_CORE_NAMESPACE=\"${AIRY_CORE_NAMESPACE}.\"\n" +
                "      echo \"Using ${AIRY_CORE_NAMESPACE} to namespace topics\"\n" +
                "    fi\n\n" +
                "    if [ -n \"${AUTH_JAAS}\" ]\n" +
                "    then\n" +
                "      export KAFKA_OPTS=\"-Dsasl.jaas.config=\"$AUTH_JAAS\n" +
                "      echo \"Using jaas authentication for connecting to Kafka\"\n" +
                "    fi\n"
                ;

        TopicsFinder finder = new TopicsFinder();


        List<String> topics = finder.findTopics();

        Method name;
        Method config;

        System.out.println(headerTemplate + "\n\n");
        try {
            for (String result : topics) {
                Class<?> topicClass = Class.forName(result);
                if (Modifier.isAbstract(topicClass.getModifiers())) {
                    continue;
                }
                name = topicClass.getMethod("name");
                config = topicClass.getMethod("config");

                String topicName = ((String) name.invoke(topicClass.getDeclaredConstructor().newInstance()));

                Map<String, String> topicConfig = (Map<String, String>) config.invoke(topicClass.getDeclaredConstructor().newInstance());

                List<String> keys = new ArrayList<>(topicConfig.keySet());

                Collections.sort(keys);

                String topicConfigFormatted = keys
                        .stream()
                        .map(k -> String.format("%s=%s", k, topicConfig.get(k)))
                        .collect(joining(" "));

                if (keys.size() > 0) {
                    topicConfigFormatted = "--config " + topicConfigFormatted;
                }

                System.out.println(String.format(createTopicTemplate, topicName, topicConfigFormatted) + "\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
