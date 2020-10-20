package co.airy.tools.topics;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.joining;

public class Application {

    public static void main(String[] args) {
        TopicsFinder finder = new TopicsFinder();

        String template = getTemplate();

        List<String> topics = finder.findTopics();

        Method name;
        Method config;

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

                System.out.println(String.format(template, topicName, topicConfigFormatted));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String getTemplate() {
        String line = "";
        StringBuilder buffer = new StringBuilder();

        try {
            try (InputStream is = (Application.class.getResourceAsStream("/topic.sh.tpl"))) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                while ((line = reader.readLine()) != null) {
                    buffer.append(line).append("\n");
                }

                reader.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return buffer.toString();
    }

}