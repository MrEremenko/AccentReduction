const words = require("../../../../language-info/EN_US/current.json");

var exclude = /["',;.:?!$%]/g;

class Word {
  constructor(original) {
    this.original = original;
    let filtered = original.replaceAll(exclude, "").toLowerCase();
    console.log("Filtered:", filtered);
    
    this.filtered = filtered;
    let mapping = [];
    let index = 0;
    for(let i = 0; i < original.length; i++) {
      if(!exclude.test(original[i])) {
        mapping.push(index); 
      }
      index++;
    }
    this.mapping = mapping;

    if(!words[filtered]) {
      console.log("Got a problem with", filtered, "<--");
      console.log(mapping);
      throw filtered
    }

    this.ipa = words[filtered];
  }
}

function convertSentenceToWordArray(sentence) {
  //idk, I'll go with this for now
  let filtered = sentence.replaceAll(exclude, "").toLowerCase();
  try {
    var words = sentence.split(/[ /]+/).filter(Boolean);
    console.log(words, words.length);
    var thingies = words.map(str => { 
      console.log("String:", str);
      return new Word(str)
    });
  } catch(e) {
    return { success: false, error: e }
  }
  return { success: true, sentence: thingies, simple: filtered };
}

module.exports = { Word, convertSentenceToWordArray }