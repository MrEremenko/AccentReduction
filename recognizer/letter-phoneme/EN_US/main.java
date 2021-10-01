import java.util.*;
import java.io.*;

public class main {

    static private class Result {
        public String word;
        public String pronunciation;
        public String[] positions;
    }

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
        ArrayList<String> createdProblemFor = new ArrayList<>();
        File f = new File(filename);
        File lastFile = new File("./EN_US/last.txt");
        File finalFile = new File("./EN_US/final.json");
        PrintWriter last = null;
        //start try catch block
        int total = 0;
        int found = 0;
        try(
            Scanner scan = new Scanner(f);
            Scanner lastReader = new Scanner(new File("./EN_US/last.txt"));
            PrintWriter finalWrite = new PrintWriter(new FileWriter(finalFile));
        ) {
            //Do a quick read from the old file
            Set<String> old = new HashSet<>();
            while(lastReader.hasNextLine()) {
                old.add(lastReader.nextLine());
            }
            finalWrite.println("{");

            last = new PrintWriter(new FileWriter(lastFile));
            //ok now I have all the previous words...
            while(scan.hasNextLine()) {
                //Retrieve the word and pronunciation(s) from line & format everything
                String[] l = scan.nextLine().replaceAll("['ˈˌ]", "").split("\\t");
                String word = l[0];
                String[] pronunciations = l[1].split(",");
                for(int i = 0; i < pronunciations.length; i++) {
                    pronunciations[i] = pronunciations[i].trim();
                }
                //get the positions for each word
                PronunciationAndPositions s = getPositions(word, pronunciations);

                if(s != null) {
                    if(total > 0)
                        finalWrite.println(",");
                    String pro = s.pronunciation;
                    String pos = s.positions;
                    found++;
                    String[] vals = pos.split(" ");
                    StringBuffer build = new StringBuffer();
                    for(int i = 0; i < vals.length; i++) {
                        String[] numbers = vals[i].split("-");
                        if(i > 0)
                            build.append(", ");
                        if(numbers.length == 1) {
                            build.append("{ \"s\": " ).append(numbers[0]).append(", \"e\": -1 }");
                        } else {
                            build.append("{ \"s\": " ).append(numbers[0]).append(", \"e\": ").append(numbers[1]).append(" }");
                        }
                    }
                    finalWrite.print("\"" + word + "\": {\"pro\": \"" + pro + "\", \"pos\": [" + build.toString() + "] }");

                } else {
                    System.out.println(word + " " + (total + 1));
                    last.println(word);
                    if(!old.contains(word)) {
                        createdProblemFor.add(word);
                    }
                }
                total++;
            }
            finalWrite.println("}");
        } catch(FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("Could not write...");
        } finally {
            last.close();
        }
        System.out.println();
        System.out.println("Created a problem for the following words");
        createdProblemFor.stream().forEach(System.out::println);
        System.out.println();
        System.out.println("\nTotal:\t" + total);
        System.out.println("Correct:\t" + found);
        System.out.println("Incorrect:\t" + (total - found));
        System.out.println(100.0 * found / total + "%");

    }

    private static class PronunciationAndPositions {
        String pronunciation;
        String positions;
        public PronunciationAndPositions(String pronunciation, String positions) {
            this.pronunciation = pronunciation;
            this.positions = positions;
        }
    }


    private static PronunciationAndPositions getPositions(String word, String[] pronunciations) {
        //ok, now we have the word in 'word' and all of the pronunciations in the pronunciations array
        for(int i = 0; i < pronunciations.length; i++) {
            Stack<String> result = new Stack<>();
            if(recursiveSolution(word, pronunciations[i].substring(1, pronunciations[i].length() - 1), 0, 0, result)) {
//                System.out.println(word);
//                System.out.println(pronunciations[i]);
                StringBuilder build = new StringBuilder();
                for(String s : result) {
                    build.append(s).append(" ");
                }
                return new PronunciationAndPositions(pronunciations[i], build.toString().trim());
            }
        }
        return null;
    }

    private static boolean recursiveSolution(String word, String pronunciation, int wordCounter,
    int pronunciationCounter, Stack<String> positions) {
        if(wordCounter == word.length() || pronunciationCounter == pronunciation.length()) {
             return true;
        }
        //do the different checks
//        System.out.println(pronunciation + " " + pronunciationCounter);
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
        String letter = word.substring(wordCounter, wordCounter + 1);

        ////////////////////////////////////////
        // now come the special cases, need to sort these out...use a helper method to check if the pronunciation or word have the given letter(s)
        ////////////////////////////////////////
//        if(letter.equals("x")) { //ks or gz
//
//        }
//        else
//        if() {
//            //if it is the <m> and /ɛm/
//
//        } else
        if(
            (stringContainsAt(pronunciation, pronunciationCounter, "wɑ") && stringContainsAt(word, wordCounter, "oi"))
//            (stringContainsAt(pronunciation, pronunciationCounter, "eɪ") && stringContainsAt(word, wordCounter, "ai"))
        ) {
            positions.push(wordCounter + "-" + (wordCounter + 1));
            positions.push(wordCounter + "-" + (wordCounter + 1));
            if(recursiveSolution(word, pronunciation, wordCounter + 2, pronunciationCounter + 2, positions)) {
                return true;
            } else {
                positions.pop();
                positions.pop();
            }
        } else if( //if it is two phonemes per a single letter
            (stringContainsAt(pronunciation, pronunciationCounter, "ju") && stringContainsAt(word, wordCounter, "u")) ||
            (stringContainsAt(pronunciation, pronunciationCounter, "ɛm") && stringContainsAt(word, wordCounter, "m")) ||
            (stringContainsAt(pronunciation, pronunciationCounter, "ʌm") && stringContainsAt(word, wordCounter, "m")) ||
            (stringContainsAt(pronunciation, pronunciationCounter, "ɛs") && stringContainsAt(word, wordCounter, "s")) ||
//            (stringContainsAt(pronunciation, pronunciationCounter, "eɪ") && stringContainsAt(word, wordCounter, "a")) ||
            (stringContainsAt(pronunciation, pronunciationCounter, "ʌn") && stringContainsAt(word, wordCounter, "n"))
        ) {
            //if it is the /ju/ sound with the u in the string...
            positions.push(Integer.toString(wordCounter));
            positions.push(Integer.toString(wordCounter));
            if(recursiveSolution(word, pronunciation, wordCounter + 1, pronunciationCounter + 2, positions)) {
                return true;
            } else {
                positions.pop();
                positions.pop();
            }
        } else {
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

    public static boolean stringContainsAt(String original, int start, String sub) {
        if(!enoughSpace(original, start, sub)) {
            return false;
        }
        for(int o = start, s = 0; o < start + sub.length(); o++, s++) {
            if(original.charAt(o) != sub.charAt(s)) {
                return false;
            }
        }
        return true;
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
        return more.length() + current <= word.length() && current >= 0;
    }

    public static void convertGivenToSimple() {

    }
}
