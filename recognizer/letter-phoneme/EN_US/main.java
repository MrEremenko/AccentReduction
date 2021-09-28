import java.util.*;
import java.io.*;

public class main {

    static HashMap<String, ArrayList<String>> graphemes = new HashMap<>();

    static {
        setGraphemeMappings(graphemes);
    }

    private static void setGraphemeMappings(HashMap<String, ArrayList<String>> map) {
        //Consonants - https://en.wikipedia.org/wiki/International_Phonetic_Alphabet#Pulmonic_consonants
        //p - voiceless bilabial stop
        ArrayList<String> voicelessBilabialStop = new ArrayList<>(Arrays.asList("p", "pp"));
        map.put("p", voicelessBilabialStop);

        //b - voiced bilabial stop
        ArrayList<String> voicedBilabialStop = new ArrayList<>(Arrays.asList("b", "bb"));
        map.put("b", voicedBilabialStop);

        //t - voiceless alveolar stop
        ArrayList<String> voicelessAlveolarStop = new ArrayList<>(Arrays.asList("pt", "t", "tt", "ed", "d", "bt", "ght", "x"));
        map.put("t", voicelessAlveolarStop);

        //d - voiced alveolar stop
        ArrayList<String> voicedAlveolarStop = new ArrayList<>(Arrays.asList("d", "dd", "de", "ld", "ed"));
        map.put("d", voicedAlveolarStop);

        //k - voiceless velar stop
        ArrayList<String> voicelessVelarStop = new ArrayList<>(Arrays.asList("c", "k", "ck", "ch", "cc", "que", "q"));
        map.put("k", voicelessVelarStop);

        //ɡ - voiced velar stop
        ArrayList<String> voicedVelarStop = new ArrayList<>(Arrays.asList("g", "gg", "gu", "gue", "gh"));
        map.put("ɡ", voicedVelarStop);

        //f - voiceless labiodental fricative
        ArrayList<String> voicelessLabiodentalFricative = new ArrayList<>(Arrays.asList("f", "ff", "lf", "fe", "ph"));
        map.put("f", voicelessLabiodentalFricative);

        //v - voiced labiodental fricative
        ArrayList<String> voicedLabiodentalFricative = new ArrayList<>(Arrays.asList("v", "ve", "f"));
        map.put("v", voicedLabiodentalFricative);

        //θ - voiceless inter-dental fricative
        ArrayList<String> voicelessInterdentalFricative = new ArrayList<>(Arrays.asList("th"));
        map.put("θ", voicelessInterdentalFricative);

        //ð - voiced inter-dental fricative
        ArrayList<String> voicedInterdentalFricative = new ArrayList<>(Arrays.asList("th", "the"));
        map.put("ð", voicedInterdentalFricative);

        //s - voiceless alveolar fricative
        ArrayList<String> voicelessAlveolarFricative = new ArrayList<>(Arrays.asList("ps", "s", "ss", "c", "sc", "se", "ce"));
        map.put("s", voicelessAlveolarFricative);

        //z - voiced alveolar fricative
        ArrayList<String> voicedAlveolarFricative = new ArrayList<>(Arrays.asList("z", "zz", "se", "s", "ze", "ss", "x"));
        map.put("z", voicedAlveolarFricative);

        //ʃ - voiceless post-alveolar fricative
        ArrayList<String> voicelessPostalveolarFricative = new ArrayList<>(Arrays.asList("sh", "ss", "ch", "ti", "ci", "s", "c", "c+ion", "s+ion"));
        map.put("ʃ", voicelessPostalveolarFricative);

        //ʒ - voiced post-alveolar fricative
        ArrayList<String> voicedPostalveolarFricative = new ArrayList<>(Arrays.asList("ge", "s", "g", "s+ion")); //g?
        map.put("ʒ", voicedPostalveolarFricative);

        //tʃ - voiceless post-alveolar affricate
        ArrayList<String> voicelessPostalveolarAffricate = new ArrayList<>(Arrays.asList("ch", "tch", "c", "t+ure", "t+ion"));
        map.put("tʃ", voicelessPostalveolarAffricate);

        //dʒ - voiced post-alveolar affricate
        ArrayList<String> voicedPostalveolarAffricate = new ArrayList<>(Arrays.asList("g", "j", "ge", "dge", "gg", "d"));
        map.put("dʒ", voicedPostalveolarAffricate);

        //ɾ - NO VOICED ALVEOLAR FLAP IN CMU-DICT!!! grrrrr

        //m - voiced bilabial nasal
        ArrayList<String> voicedBilabialNasal = new ArrayList<>(Arrays.asList("m", "mm", "mb", "me", "mn"));
        map.put("m", voicedBilabialNasal);

        //n - voiced alveolar nasal
        ArrayList<String> voicedAlveolarNasal = new ArrayList<>(Arrays.asList("n", "nn", "kn", "ne", "pn", "gn", "en", "an"));
        map.put("n", voicedAlveolarNasal);

        //ŋ - voiced velar nasal
        ArrayList<String> voicedVelarNasal = new ArrayList<>(Arrays.asList("ng", "n"));
        map.put("ŋ", voicedVelarNasal);

        //ɫ or just l - voiced alveolar lateral liquid
        ArrayList<String> voicedAlveolarLateralLiquid = new ArrayList<>(Arrays.asList("l", "ll", "le", "il", "al", "el", "ul"));
        map.put("ɫ", voicedAlveolarLateralLiquid);

        //ɹ - voiced alveolar retroflex liquid
        ArrayList<String> voicedAlveolarRetroflexLiquid = new ArrayList<>(Arrays.asList("r", "rr", "wr", "rh"));
        map.put("ɹ", voicedAlveolarRetroflexLiquid);

        //w - voiced labial-velar glide
        ArrayList<String> voicedLabialVelarGlide = new ArrayList<>(Arrays.asList("w", "wh", "u", "o"));
        map.put("w", voicedLabialVelarGlide);

        //ʍ - WILL NOT USE VOICELESS LABIAL-VELAR FRICATIVE (glide?)

        //j - voiced palatal glide
        ArrayList<String> voicedPalatalGlide = new ArrayList<>(Arrays.asList("y", "u", "io", "i")); //i?
        map.put("j", voicedPalatalGlide);

        //Ok, now onto the vowels
        //i - close front unrounded
        ArrayList<String> closeFrontUnrounded = new ArrayList<>(Arrays.asList("ea", "ee", "ie", "ei", "y", "e", "ey", "i", "eo"));
        map.put("i", closeFrontUnrounded);

        //ɪ - near close near front unrounded
        ArrayList<String> nearCloseNearFrontUnrounded = new ArrayList<>(Arrays.asList("i", "y", "ui", "o", "u", "a"));
        map.put("ɪ", nearCloseNearFrontUnrounded);

        //ɛ - open mid front unrounded
        ArrayList<String> openMidFrontUnrounded = new ArrayList<>(Arrays.asList("e", "ea", "ai", "ay", "ue"));
        map.put("ɛ", openMidFrontUnrounded);

        //æ - near open front unrounded
        ArrayList<String> nearOpenFrontUnrounded = new ArrayList<>(Arrays.asList("a", "a_e", "ai", "ai", "ay", "eigh", "ey", "au"));
        map.put("æ", nearOpenFrontUnrounded);

        //u - close back rounded
        ArrayList<String> closeBackRounded = new ArrayList<>(Arrays.asList("oo", "u", "o_e", "o", "ou", "oe", "a", "ew"));
        map.put("u", closeBackRounded);

        //ʊ - near close near back rounded
        ArrayList<String> nearCloseNearBackRounded = new ArrayList<>(Arrays.asList("oo", "u", "ou"));
        map.put("ʊ", nearCloseNearBackRounded);

        //ɔ - open mid back rounded
        ArrayList<String> openMidBackRounded = new ArrayList<>(Arrays.asList("o", "a", "au", "oo", "oa", "aw", "ough", "augh", "ou"));
        map.put("ɔ", openMidBackRounded);

        //ɑ - open back unrounded
        ArrayList<String> openBackUnrounded = new ArrayList<>(Arrays.asList("a", "al", "ea", "o"));
        map.put("ɑ", openBackUnrounded);

        //ʌ - open mid back unrounded
        ArrayList<String> openMidBackUnrounded = new ArrayList<>(Arrays.asList("u", "ou", "o", "oo", "oe", "a", "au"));
        map.put("ʌ", openMidBackUnrounded);

        //ə - DOESN'T USE THE MID CENTRAL

        //ɝ - r colored vowel; I guess we are adding this one
        ArrayList<String> rColoredVowel = new ArrayList<>(Arrays.asList("ar", "er", "ir", "ur", "or"));
        map.put("ɝ", rColoredVowel);

        //now diphthongs
        //aɪ - ai
        ArrayList<String> aiVowel = new ArrayList<>(Arrays.asList("i", "ei", "ai", "oi", "is", "igh", "uy", "ey", "y"));
        map.put("aɪ", aiVowel);

        //aʊ - a ow
        ArrayList<String> aowVowel = new ArrayList<>(Arrays.asList("ou", "ow", "ough", "owe"));
        map.put("aʊ", aowVowel);

        //ɔɪ - o i
        ArrayList<String> oiVowel = new ArrayList<>(Arrays.asList("oy", "oi"));
        map.put("ɔɪ", oiVowel);

        //oʊ - oh
        ArrayList<String> ohVowel = new ArrayList<>(Arrays.asList("o", "oh", "oa", "ea", "ow", "ou", "ough"));
        map.put("oʊ", ohVowel);

        //eɪ - ey
        ArrayList<String> eyVowel = new ArrayList<>(Arrays.asList("ai", "ei", "ea", "ey", "au", "a", "eigh"));
        map.put("eɪ", eyVowel);
    }

    public static void main(String[] args) {
        graphemes.entrySet().stream().forEach(a -> System.out.println(a));
        startProcess("./EN_US/given-updated.txt");
    }

    public static void startProcess(String filename) {
        File f = new File(filename);
        try(
            Scanner scan = new Scanner(f);
        ) {
            while(scan.hasNextLine()) {
                String[] l = scan.nextLine().replaceAll("['ˈˌ]", "").split("\\t");
                String word = l[0];
                String[] pronunciations = l[1].split(",");
                for(int i = 0; i < pronunciations.length; i++) {
                    pronunciations[i] = pronunciations[i].trim();
                }
//                System.out.println(word + "-->" + Arrays.toString(pronunciations) + " " + pronunciations.length);

                //ok, now we have the word in 'word' and all of the pronunciations in the pronunciations array
                int wordCounter = 0;
                for(int i = 0; i < pronunciations.length; i++) {
                    int pCounter = 0;
                    String pro = pronunciations[i].substring(1, pronunciations[i].length() - 1);
                    ArrayList<Integer> positions = new ArrayList<>();
                    while(pCounter < pro.length()) {
                        String character = pro.substring(pCounter, pCounter + 1);
                        //if it could be a dipthong
                        if(pCounter < pro.length() - 1 && graphemes.containsKey(pro.substring(pCounter, pCounter + 2))) {
                            character = pro.substring(pCounter, pCounter + 2);
                        }
                        if(!graphemes.containsKey(character)) {
                            System.out.println("OK dude, this phoneme doesn't exist, figure it out... " + character);
                            return;
                        }
                        ArrayList<String> graphemeList = graphemes.get(character);
                        int longest = 0;
                        for(String graph : graphemeList) {
                            //if the grapheme fits into what is left of the word AND its equal
                            if(graph.length() + wordCounter <= word.length() && word.substring(wordCounter, wordCounter + graph.length()).equals(graph)) {
                                if(graph.length() > longest) {
                                    longest = graph.length();
                                }
                            }

                        }
                        //ok, now we should have the largest # of characters that this phoneme takes up
                        if(longest == 0) {
                            System.out.println("NO CHARACTERS FOR SAID PHONEME....");
                            System.out.println("Word: " + word);
                            System.out.println("IPA: /" + pro + "/");
                            System.out.println("Phoneme: " + character);
                            System.out.println("Graphemes: " + graphemeList);
                            System.out.println("So far: " + positions + "\n");
                            if(i == pro.length() - 1)
                                return;
                        }
                        //we just need to save this somewhere, and move forward the appropriate amount for the word and phoneme counter
                        positions.add(longest);
                        pCounter += character.length();
                        wordCounter += longest;
                    }
                    System.out.println(word + "  /" + pro + "/  " + positions);
                    pCounter = 0;
                }
            }
        } catch(FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static void convertGivenToSimple() {

    }
}
