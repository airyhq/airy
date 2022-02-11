package co.airy.core.api.config.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagConfig {
    @Builder.Default
    private DefaultTagColor colors = DefaultTagColor.builder().build();
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class DefaultTagColor {
    private static final String GREEN_MAIN = "0E764F";
    private static final String GREEN_BACKGROUND = "F5FFFB";
    private static final String RED_MAIN = "E0243A";
    private static final String RED_BACKGROUND = "FFF7F9";
    private static final String BLUE_MAIN = "1578D4";
    private static final String BLUE_BACKGROUND = "F5FFFB";
    private static final String PURPLE_MAIN = "730A80";
    private static final String PURPLE_BACKGROUND = "FEF7FF";

    @Builder.Default
    private TagDescription tagGreen = TagDescription.builder()
            .deflt(GREEN_MAIN)
            .background(GREEN_BACKGROUND)
            .font(GREEN_MAIN)
            .position(3)
            .border(GREEN_MAIN)
            .build();
    @Builder.Default
    private TagDescription tagBlue = TagDescription.builder()
            .deflt(BLUE_MAIN)
            .background(BLUE_BACKGROUND)
            .font(BLUE_MAIN)
            .position(1)
            .border(BLUE_MAIN)
            .build();
    @Builder.Default
    private TagDescription tagRed = TagDescription.builder()
            .deflt(RED_MAIN)
            .background(RED_BACKGROUND)
            .font(RED_MAIN)
            .position(2)
            .border(RED_MAIN)
            .build();
    @Builder.Default
    private TagDescription tagPurple = TagDescription.builder()
            .deflt(PURPLE_MAIN)
            .background(PURPLE_BACKGROUND)
            .font(PURPLE_MAIN)
            .position(4)
            .border(PURPLE_MAIN)
            .build();
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TagDescription {
    private String deflt;
    private String background;
    private String font;
    private int position;
    private String border;
}
