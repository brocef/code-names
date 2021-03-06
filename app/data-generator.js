"use strict";

const fs = require('fs');
const path = require('path');
const CardType = require('./card-type.js');

const WORDS_FILE_PATH = path.join(__dirname, '../data/codenames-words.json');
const MADDIE_WORDS_FILE_PATH = path.join(__dirname, '../data/codenames-maddie.json');

const INPUT_WORD_PATHS = [
  WORDS_FILE_PATH,
  MADDIE_WORDS_FILE_PATH
];

const DEATH_CARD_COUNT = 1;

/// Generates random data for each game session.
class DataGenerator {
  constructor() {
    /// All words in an array.
    var tempWords = [];
    console.log("Loading words from: ");
    INPUT_WORD_PATHS.forEach(path => {
      console.log(path);
      tempWords = tempWords.concat(JSON.parse(fs.readFileSync(path, 'utf8')));
    });
    this.words = [...new Set(tempWords)];
    console.log("Loaded " + this.words.length.toString() + " words and removed "
        + (tempWords.length - this.words.length).toString() + " duplicates");
  }

  /// Retrieves a random array of words.
  getWords(wordCount, usedWords) {
    var words = new Set();
    while (words.size < wordCount) {
      const index = parseInt(Math.random() * this.words.length)
      const word = this.words[index];
      if (!usedWords.includes(word)) {
        words.add(word);
      } else {
        console.log(`skipping previously used word ${word}`)
      }
    }

    return Array.from(words);
  }

  /// Returns either CardType.RED or CardType.BLUE.
  getStartingTeam() {
    return parseInt(Math.random() * 2) === 0 ? CardType.RED : CardType.BLUE;
  }

  /// Retrieves a random array of types.
  getCardTypes(typeCount, startingTeam) {
    var deathCardCount = DEATH_CARD_COUNT;
    var startingTeamCardCount = parseInt(typeCount / 3) + 1;
    var secondTeamCardCount = startingTeamCardCount - 1;
    var neutralCardCount = typeCount - deathCardCount - startingTeamCardCount -
      secondTeamCardCount;

    var cardTypes = new Array(typeCount);
    cardTypes = DataGenerator._setCardTypes(cardTypes, CardType.DEATH,
      deathCardCount);
    cardTypes = DataGenerator._setCardTypes(cardTypes, startingTeam,
      startingTeamCardCount);
    cardTypes = DataGenerator._setCardTypes(
      cardTypes,
      startingTeam === CardType.RED ? CardType.BLUE : CardType.RED,
      secondTeamCardCount);
    cardTypes = DataGenerator._setCardTypes(cardTypes, CardType.NEUTRAL,
      neutralCardCount);

    return cardTypes;
  }

  /// Sets a [typeCount] of card T
  static _setCardTypes(cardTypes, cardType, typeCount) {
    while (typeCount > 0) {
      const index = parseInt(Math.random() * cardTypes.length);
      if (cardTypes[index] === undefined) {
        cardTypes[index] = cardType.toString();
        typeCount--;
      }
    }
    return cardTypes;
  }
}

module.exports = new DataGenerator();
