package co.airy.text.format;

public class TextFormat {
    public static String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }

        char baseChar = str.charAt(0);
        char updatedChar;
        updatedChar = Character.toUpperCase(baseChar);
        if (baseChar == updatedChar) {
            return str;
        }

        char[] chars = str.toCharArray();
        chars[0] = updatedChar;
        return new String(chars, 0, chars.length);
    }
}
