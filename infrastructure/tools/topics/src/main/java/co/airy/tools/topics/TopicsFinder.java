package co.airy.tools.topics;

import co.airy.kafka.schema.Topic;

import java.io.File;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static java.io.File.separatorChar;

public class TopicsFinder {

    private Class<co.airy.kafka.schema.Topic> superClass;

    protected Set<String> classes = new HashSet<>();

    TopicsFinder() {
        this.superClass = Topic.class;
    }

    private void addClassName(String className) {
        try {
            Class theClass = Class.forName(className, false, getClass().getClassLoader());

            if (superClass.isAssignableFrom(theClass)) {
                if (!theClass.isInterface()) {
                    classes.add(className);
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    Set<String> findTopics() {
        String classpath = System.getProperty("java.class.path");
        String pathSeparator = System.getProperty("path.separator");

        StringTokenizer st = new StringTokenizer(classpath, pathSeparator);

        while (st.hasMoreTokens()) {
            File currentDirectory = new File(st.nextToken());

            processFile(currentDirectory.getAbsolutePath(), "");
        }

        return classes;
    }

    private void processFile(String base, String current) {
        File currentDirectory = new File(base + separatorChar + current);

        if (isArchive(currentDirectory.getName())) {
            try {
                processZip(new ZipFile(currentDirectory));
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Set<File> directories = new HashSet<>();

            File[] children = currentDirectory.listFiles();

            if (children == null || children.length == 0) {
                return;
            }

            for (File child : children) {
                if (child.isDirectory()) {
                    directories.add(child);
                } else {
                    if (child.getName().endsWith(".class")) {
                        String className = getClassName(current + ((current.equals("")) ? "" : File.separator) + child.getName());
                        addClassName(className);
                    }
                }
            }

            for (Object directory : directories) {
                processFile(base, current + ((current.equals("")) ? "" : File.separator) + ((File) directory).getName());
            }
        }
    }

    private boolean isArchive(String name) {
        return (name.endsWith(".jar") || (name.endsWith(".zip")));
    }

    private String getClassName(String fileName) {
        String newName = fileName.replace(separatorChar, '.');
        newName = newName.replace('/', '.');
        return newName.substring(0, fileName.length() - 6);
    }

    private void processZip(ZipFile file) {
        Enumeration files = file.entries();

        while (files.hasMoreElements()) {
            ZipEntry child = (ZipEntry) files.nextElement();
            if (child.getName().endsWith(".class")) {
                addClassName(getClassName(child.getName()));
            }
        }
    }
}

