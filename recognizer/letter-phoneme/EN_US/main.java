import java.util.*;
import java.io.*;

public class main {

    static HashMap<String, ArrayList<String>> map = new HashMap<>();

    static {
        setGraphemeMappings(map);
    }

    private static void setGraphemeMappings(HashMap<String, ArrayList<String>> map) {
        //Consonants - https://en.wikipedia.org/wiki/International_Phonetic_Alphabet#Pulmonic_consonants
        //p - voiceless bilabial stop
        ArrayList<String> voicelessBilabialStop = new ArrayList<>(Arrays.asList("p", "pp"));
        //b - voiced bilabial stop
        ArrayList<String> voicedBilabialStop = new ArrayList<>(Arrays.asList("b", "bb"));
        //t - voiceless alveolar stop
        ArrayList<String> voicelessAlveolarStop = new ArrayList<>(Arrays.asList("t", "tt", "ed", "bt", "ght"));
        //d - voiced alveolar stop
        ArrayList<String> voicedAlveolarStop = new ArrayList<>(Arrays.asList("d", "dd", "de", "ld", "ed"));
        //k - voiceless velar stop
        ArrayList<String> voicelessVelarStop = new ArrayList<>(Arrays.asList("c", "k", "ck", "ch", "cc", "que", "q"));
        //g - voiced velar stop
        ArrayList<String> voicedVelarStop = new ArrayList<>(Arrays.asList("g", "gg", "gu", "gue", "gh"));
        //f - voiceless labiodental fricative
        ArrayList<String> voicelessLabiodentalFricative = new ArrayList<>(Arrays.asList("f", "ff", "lf", "fe", "ph"));
        //v - voiced labiodental fricative
        ArrayList<String> voicedLabiodentalFricative = new ArrayList<>(Arrays.asList("v", "ve", "f"));
        //θ - voiceless inter-dental fricative
        ArrayList<String> voicelessInterdentalFricative = new ArrayList<>(Arrays.asList("th"));
        //ð - voiced inter-dental fricative
        ArrayList<String> voicedInterdentalFricative = new ArrayList<>(Arrays.asList("th", "the"));
        //s - voiceless alveolar fricative
        ArrayList<String> voicelessAlveolarFricative = new ArrayList<>(Arrays.asList("ps", "s", "ss", "c", "sc", "se", "ce"));
        //z - voiced alveolar fricative
        ArrayList<String> voicedAlveolarFricative = new ArrayList<>(Arrays.asList("z", "zz", "se", "s", "ze", "ss", "x"));
        //ʃ - voiceless post-alveolar fricative
        ArrayList<String> voicelessPostalveolarFricative = new ArrayList<>(Arrays.asList("sh", "ss", "ch", "ti", "ci", "s", "c", "c+ion", "s+ion"));
        //ʒ - voiced post-alveolar fricative
        ArrayList<String> voicedPostalveolarFricative = new ArrayList<>(Arrays.asList("ge", "s", "g", "s+ion")); //g?
        //tʃ - voiceless post-alveolar affricate
        ArrayList<String> voicelessPostalveolarAffricate = new ArrayList<>(Arrays.asList("ch", "tch", "c", "t+ure", "t+ion"));
        //dʒ - voiced post-alveolar affricate
        ArrayList<String> voicedPostalveolarAffricate = new ArrayList<>(Arrays.asList("g", "j", "ge", "dge", "gg", "d"));

        //ɾ - NO VOICED ALVEOLAR FLAP IN CMU-DICT!!! grrrrr

        //m - voiced bilabial nasal
        ArrayList<String> voicedBilabialNasal = new ArrayList<>(Arrays.asList("m", "mm", "mb", "me", "mn"));
        //n - voiced alveolar nasal
        ArrayList<String> voicedAlveolarNasal = new ArrayList<>(Arrays.asList("n", "nn", "kn", "ne", "pn", "gn", "en", "an"));
        //ŋ - voiced velar nasal
        ArrayList<String> voicedVelarNasal = new ArrayList<>(Arrays.asList("ng", "n"));
        //ɫ or just l - voiced alveolar lateral liquid
        ArrayList<String> voicedAlveolarLateralLiquid = new ArrayList<>(Arrays.asList("l", "ll", "le", "il", "al", "el", "ul"));
        //ɹ - voiced alveolar retroflex liquid
        ArrayList<String> voicedAlveolarRetroflexLiquid = new ArrayList<>(Arrays.asList("r", "rr", "wr", "rh"));
        //w - voiced labial-velar glide
        ArrayList<String> voicedLabialVelarGlide = new ArrayList<>(Arrays.asList("w", "wh", "u", "o"));

        //ʍ - WILL NOT USE VOICELESS LABIAL-VELAR FRICATIVE (glide?)

        //j - voiced palatal glide
        ArrayList<String> voicedPalatalGlide = new ArrayList<>(Arrays.asList("y", "u", "io", "i")); //i?

        //Ok, now onto the vowels
        //i - close front unrounded
        //ɪ - near close near front unrounded
        //ɛ - open mid front unrounded
        //æ - near open front unrounded
        //u - close back rounded
        //ʊ - near close near back rounded
        //ɔ - open mid back rounded
        //a - open front unrounded
        //


    }

    public static void main(String[] args) {

    }

    public static void convertGivenToSimple() {

    }
}
