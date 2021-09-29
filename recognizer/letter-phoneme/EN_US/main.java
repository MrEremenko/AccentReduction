import java.util.*;
import java.io.*;

public class main {

    static HashMap<String, ArrayList<String>> graphemes = new HashMap<>();

    static {
        setGraphemeMappings(graphemes);
    }

    private static void setGraphemeMappings(HashMap<String, ArrayList<String>> map) {
        //https://en.wikipedia.org/wiki/International_Phonetic_Alphabet#Pulmonic_consonants
        File f = new File("./EN_US/graphemes.txt");
        try (
            Scanner scan = new Scanner(f);
        ){
            while(scan.hasNextLine()) {
                String[] line = scan.nextLine().split(" ", 2);
                map.put(line[0], new ArrayList<String>(Arrays.asList(line[1].split(" "))));
            }
        } catch(FileNotFoundException e) {

        }

    }

    public static void main(String[] args) {
        graphemes.entrySet().stream().forEach(a -> {
            System.out.print(a.getKey());
            for(int i = 0; i < a.getValue().size(); i++) {
                System.out.print(" " + a.getValue().get(i));
            }
            System.out.println();
        });
        startProcess("./EN_US/given-updated.txt");
    }

    private static void startProcess(String filename) {
        //create file
        File f = new File(filename);
        //start try catch block
        int total = 0;
        int found = 0;
        try(Scanner scan = new Scanner(f)) {
            while(scan.hasNextLine()) {
                //Retrieve the word and pronunciation(s) from line & format everything
                String[] l = scan.nextLine().replaceAll("['ˈˌ]", "").split("\\t");
                String word = l[0];
                String[] pronunciations = l[1].split(",");
                for(int i = 0; i < pronunciations.length; i++) {
                    pronunciations[i] = pronunciations[i].trim();
                }
                //get the positions for each word
                Stack<String> s = getPositions(word, pronunciations);
                if(s != null) {
                    found++;
                } else {
                    System.out.println(word);
                }
                total++;
            }
        } catch(FileNotFoundException e) {
            e.printStackTrace();
        }
        System.out.println("Total:\t" + total);
        System.out.println("Correct:\t" + found);
        System.out.println("Incorrect:\t" + (total - found));
        System.out.println(100.0 * found / total + "%");
    }


    private static Stack<String> getPositions(String word, String[] pronunciations) {
        //ok, now we have the word in 'word' and all of the pronunciations in the pronunciations array
        for(int i = 0; i < pronunciations.length; i++) {
            Stack<String> result = new Stack<>();
            if(recursiveSolution(word, pronunciations[i].substring(1, pronunciations[i].length() - 1), 0, 0, result)) {
//                System.out.println(word);
//                System.out.println(pronunciations[i]);
                return result;
            }
        }
        return null;
    }

    private static boolean getWordPosition(String word, String pronunciation, Stack<String> positions) {
        //counter for the word
        int wordCounter = 0;
        //counter for the ipa counter
        int phonemeCounter = 0;
        //grab the phoneme
        //loop though the pronunciation_ to get the mapping to the characters unitl the end
        while(phonemeCounter < pronunciation.length()) {
            //Monophthongs
            String phoneme = pronunciation.substring(phonemeCounter, phonemeCounter + 1);
            //if it could be a diphthong
            if(phonemeCounter < pronunciation.length() - 1 && graphemes.containsKey(pronunciation.substring(phonemeCounter, phonemeCounter + 2))) {
                phoneme = pronunciation.substring(phonemeCounter, phonemeCounter + 2);
            }
            //if it doesn't exist
            if(!graphemes.containsKey(phoneme)) {
                System.out.println("OK dude, this phoneme doesn't exist, figure it out... " + phoneme);
                return false;
            }
            //grab the list of graphemes for the said phoneme
            ArrayList<String> graphemeList = graphemes.get(phoneme);

            //now do manual checks

            int longest = 0;
            for(String graph : graphemeList) {
                //if the grapheme fits into what is left of the word AND its equal
                if(enoughSpace(word, wordCounter, graph) && word.substring(wordCounter, wordCounter + graph.length()).equals(graph)) {
                    if(graph.length() > longest) {
                        longest = graph.length();
                    }
                }

            }
            //ok, now we should have the largest # of phonemes that this phoneme takes up
            if(longest == 0) {
                System.out.println("NO CHARACTERS FOR SAID PHONEME....");
                System.out.println("Word: " + word);
                System.out.println("IPA: /" + pronunciation + "/");
                System.out.println("Phoneme: " + phoneme);
                System.out.println("Graphemes: " + graphemeList);
                System.out.println("So far: " + positions + "\n");
//                if(i == pronunciation.length() - 1)
//                    return false;
            }
            //we just need to save this somewhere, and move forward the appropriate amount for the word and phoneme counter
//            positions.add(longest);
            phonemeCounter += phoneme.length();
            wordCounter += longest;
        }
        System.out.println(word + "  /" + pronunciation + "/  " + positions);
        phonemeCounter = 0;
        return true;
    }

    private static boolean recursiveSolution(String word, String pronunciation, int wordCounter,
    int pronunciationCounter, Stack<String> positions) {
        if(wordCounter == word.length() || pronunciationCounter == pronunciation.length()) {
             return true;
        }
        //do the different checks
        String phoneme = pronunciation.substring(pronunciationCounter, pronunciationCounter + 1);
        //if it could be a diphthong
        if(pronunciationCounter < pronunciation.length() - 1 && graphemes.containsKey(pronunciation.substring(pronunciationCounter, pronunciationCounter + 2))) {
            phoneme = pronunciation.substring(pronunciationCounter, pronunciationCounter + 2);
        }
        //if it doesn't exist
        if(!graphemes.containsKey(phoneme)) {
            System.out.println("OK dude, this phoneme doesn't exist, figure it out... " + phoneme);
            return false;
        }
        //grab the list of graphemes for the said phoneme
        ArrayList<String> graphemeList = graphemes.get(phoneme);
//        System.out.println(wordCounter);
//        System.out.println(positions);
        String letter = word.substring(wordCounter, wordCounter + 1);

//        if(letter.equals("x")) { //ks or gz
//
//        } //this is
//        else if(phoneme.equals("j") && enoughSpace(pronunciation, pronunciationCounter, "u") &&
//        pronunciation.charAt(pronunciationCounter + 1) == 'u' && word.charAt(wordCounter) == 'u') {
//            //if it is the /ju/ sound
//            positions.push(wordCounter + "-" + (wordCounter + 1));
//            positions.push(wordCounter + "-" + (wordCounter + 1));
//            if(recursiveSolution(word, pronunciation, wordCounter + 1,
//                    pronunciationCounter + phoneme.length(), positions)) {
//                return true;
//            } else {
//                positions.pop();
//                positions.pop();
//            }
//        } else
        {
            for(String graph : graphemeList) {
                if(enoughSpace(word, wordCounter, graph)) {
                    String letters = word.substring(wordCounter, wordCounter + graph.length());
                    if(letters.equals(graph)) {
//                        System.out.println("word: " + word);
//                        System.out.println("wordCounter: " + wordCounter);
//                        System.out.println("phoneme: " + phoneme);
                        positions.push(letters.length() == 1 ? wordCounter + "" :  wordCounter + "-" + (wordCounter + letters.length() - 1));
                        if(recursiveSolution(word, pronunciation, wordCounter + graph.length(),
                                pronunciationCounter + phoneme.length(), positions)) {
                            return true;
                        } else {
                            positions.pop();
                        }
                    }
                }
            }
        }
        return false;
    }

    private static int amountOfPhonemes(String pronunciation) {
        int counter = 0;
        int amount = 0;
        do {
            String phoneme = pronunciation.substring(counter, counter + 1);
            if(counter < pronunciation.length() - 1 && graphemes.containsKey(pronunciation.substring(counter, counter + 2))) {
                phoneme = pronunciation.substring(counter, counter + 2);
            }
            counter += phoneme.length();
            amount++;
        }
        while(counter < pronunciation.length());
        return amount;
    }

    private static boolean enoughSpace(String word, int current, String more) {
        return more.length() + current <= word.length();
    }

    public static void convertGivenToSimple() {

    }
}
