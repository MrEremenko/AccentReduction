import org.junit.Test;

import static org.junit.Assert.*;

public class GraphemeTest {
//    @Test
//    public void testGraphemes() {
//
//    }

    @Test
    public void testStringContainsAt() {
        String[] originalTrue = {
                "lyrically", "procrastinating", "sparkling", "vichyssoise", "vickerman", "victorian",
                "ɫaɪsɪstɹɑtʌ", "vaɪspɹɛzʌdɛnʃʌɫ", "vɪdioʊteɪpt", "vjupɔɪnts", "ɫɛnɝt", "fʌndɝz"
        };
        String[] subTrue = {
                "lyr", "roc", "g", "oise", "an", "victorian",
                "ɫaɪs", "dɛnʃ", "t", "ts", "ɫɛnɝt", "z"
        };
        int[] startTrue = {
                0, 1, 8, 7, 7, 0,
                0, 9, 10, 7, 0, 5
        };

        for(int i = 0; i < originalTrue.length; i++) {
            assertTrue(main.stringContainsAt(originalTrue[i], startTrue[i], subTrue[i]));
        }

        String[] originalFalse = {
                "lyrically", "procrastinating", "sparkling", "vichyssoise", "vickerman", "victorian",
                "ɫaɪsɪstɹɑtʌ", "vaɪspɹɛzʌdɛnʃʌɫ", "vɪdioʊteɪpt", "vjupɔɪnts", "ɫɛnɝt", "fʌndɝz"
        };
        String[] subFalse = {
                "lyr", "roc", "g", "ise", "an", "victory",
                "ɫaɪs", "dɛnʃ", "t", "ts", "ɫɛnɝt", "z"
        };
        int[] startFalse = {
                -1, 20, 9, 7, 6, 0,
                9, 2, 8, 3, 1, 4
        };

        for(int i = 0; i < originalFalse.length; i++) {
            assertFalse(main.stringContainsAt(originalFalse[i], startFalse[i], subFalse[i]));
        }
    }
}
