package co.airy.ts_generator;

import cz.habarta.typescript.generator.Input;
import cz.habarta.typescript.generator.JsonLibrary;
import cz.habarta.typescript.generator.Output;
import cz.habarta.typescript.generator.Settings;
import cz.habarta.typescript.generator.TypeScriptFileType;
import cz.habarta.typescript.generator.TypeScriptGenerator;
import cz.habarta.typescript.generator.TypeScriptOutputKind;

import java.io.File;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        final Settings settings = new Settings();

        settings.outputKind = TypeScriptOutputKind.module; // Needed to generate `export` statements
        settings.outputFileType = TypeScriptFileType.implementationFile;
        settings.jsonLibrary = JsonLibrary.jackson2;
        settings.setExcludeFilter(List.of("java.io.Serializable"), List.of("**.**Builder"));

        final TypeScriptGenerator generator = new TypeScriptGenerator(settings);

        final Input.Parameters parameters = new Input.Parameters();

        parameters.debug = false;
        parameters.classNamePatterns = List.of("co.airy.mapping.model.**");

        final File output = new File(System.getenv().get("BUILD_WORKSPACE_DIRECTORY") + "/frontend/types/content.ts");
        settings.validateFileName(output);

        generator.generateTypeScript(Input.from(parameters), Output.to(output));
    }
}
