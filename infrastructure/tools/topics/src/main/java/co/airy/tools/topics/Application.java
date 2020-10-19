package co.airy.tools.topics;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Application {

    public Application() {
        TopicsFinder finder = new TopicsFinder();

        String template = getTemplate("sh");


        Set<String> results = finder.findTopics();
        ArrayList<String> resultsSortedNames = new ArrayList<>(results);

        Collections.sort(resultsSortedNames);

        createScriptOutput(resultsSortedNames, template);

    }

    private void createScriptOutput(ArrayList<String> resultsSortedNames, String template) {
        Method name;
        Method config;

        try {

            BufferedWriter out = new BufferedWriter(new FileWriter(Instant.now().getEpochSecond() + "_topics.sh", true));

            for (String result : resultsSortedNames) {
                Class topicClass = Class.forName(result);
                if (Modifier.isAbstract(topicClass.getModifiers())) {
                    continue;
                }
                name = topicClass.getMethod("name");
                config = topicClass.getMethod("config");

                String topicName = ((String) name.invoke(topicClass.getDeclaredConstructor().newInstance(), null)).replace(".", "_");

                Map<String, String> topicConfig = (Map<String, String>) config.invoke(topicClass.getDeclaredConstructor().newInstance(), null);

                List<String> keys = new ArrayList<>(topicConfig.keySet());

                Collections.sort(keys);

                String topicConfigFormatted = keys.stream().map(k -> String.format("%s=%s", k, topicConfig.get(k))).collect(Collectors.joining(" "));

                if (keys.size() > 0) {
                    topicConfigFormatted = "--config " + topicConfigFormatted;
                }

                String replaced = String.format(template, topicName, topicConfigFormatted);
                System.out.println(replaced);

                out.write(replaced + "\n");
            }
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createTerraformOutput(ArrayList<String> resultsSortedNames, String template) throws IOException {
        Method name;
        Method config;

        try {

            BufferedWriter out = new BufferedWriter(new FileWriter(new Date().toString() + "topics.tf", true));

            for (String result : resultsSortedNames) {
                Class topicClass = Class.forName(result);
                if (Modifier.isAbstract(topicClass.getModifiers())) {
                    continue;
                }
                name = topicClass.getMethod("name");
                config = topicClass.getMethod("config");

                String topicName = ((String) name.invoke(topicClass.getDeclaredConstructor().newInstance(), null)).replace(".", "_");

                Map<String, String> topicConfig = (Map<String, String>) config.invoke(topicClass.getDeclaredConstructor().newInstance(), null);

                List<String> keys = new ArrayList<>(topicConfig.keySet());

                Collections.sort(keys);

                String topicConfigFormatted = keys.stream().map(k -> String.format("\t\"%s\" = \"%s\"", k, topicConfig.get(k))).collect(Collectors.joining("\n"));


                String replaced = String.format(template, topicName, topicName, topicConfigFormatted);

                out.write(replaced + "\n");
            }
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getTemplate(String format) {
        String line = "";
        StringBuilder buffer = new StringBuilder();

        try {
            try (InputStream is = (getClass().getResourceAsStream(String.format("/topic.%s.tpl", format)))) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                while ((line = reader.readLine()) != null) {
                    buffer.append(line).append("\n");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return buffer.toString();
    }

    public static void main(String[] args) {
        new Application();
    }
}