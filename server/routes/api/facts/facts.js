require("dotenv").config({path:__dirname + '/../../.env'});
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid');
const translator = short();
var AWS = require('aws-sdk');
const { default: axios } = require("axios");
AWS.config.update({region: 'us-west-2'});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-1'});
var Url = require('url-parse');
const { clickLikeFact } = require("./helper/updateVote");

const waybackSave = "https://web.archive.org/save/"


const Redis = require("ioredis");
const { getKeywordsFromText, createFactIndex, deleteFactIndex, searchFactIndex } = require("./helper/indexHelper");
const { createFact, deleteFact, recordFactDeletion, updateArchiveLink, saveToWayback } = require("./helper/factHelper");
const { isAuthenticated } = require("../../auth/authenticated");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object

module.exports = (passport) => {

var verySimpleFactsSample = [
  {
    id: "123",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: true,
    disliked: false,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "456",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "789",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "111",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "222",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "333",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
  {
    id: "444",
    title: "First title",
    sourceCredebility: "CREDIBLE",
    likes: 33,
    dislikes: 21,
    liked: false,
    disliked: true,
    originalLink: "http://brave.com",
    archiveLink: "http://archive.org",
    howToFind: "ctrl-f brave",
    description: "This is a sample description, don't take it too personally!!!"
  },
]

var youtubeVideoFacts = {
  facts: [
    {
      postId: "111",
      factCheckId: "1",
      time: 5,                      //always in seconds
      likes: 21,
      dislikes: 55,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"ben shapiro saying a quote...\"",
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "2",
      time: 10,                      //always in seconds
      likes: 0,
      dislikes: 17,
      liked: -1,                      //can be -1, 0, 1
      stance: 0,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"yeah this right here......\"",
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "3",
      time: 15,                      //always in seconds
      likes: 19,
      dislikes: 20,
      liked: -1,                      //can be -1, 0, 1
      stance: -1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"this thingy right heeeeereeeeee...\"",
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "4",
      time: 20,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "5",
      time: 26,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "6",
      time: 33,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "7",
      time: 37,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "8",
      time: 43,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "9",
      time: 47,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "10",
      time: 52,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "11",
      time: 57,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "12",
      time: 167,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
    {
      postId: "111",
      factCheckId: "13",
      time: 247,                      //always in seconds
      likes: 33,
      dislikes: 21,
      liked: -1,                      //can be -1, 0, 1
      stance: 1,
      posterId: 123456789,            //this will get queried from redis...
      quote: "\"quote of what the fact is covering...\"",
      reactions: [
        {
          word: "Irrelevant",
          amount: 44
        },
        {
          word: "Correct",
          amount: 33
        },
        {
          word: "Testing",
          amount: 32
        },
        {
          word: "Immoral",
          amount: 30
        },
        {
          word: "False",
          amount: 22
        },
        {
          word: "Dormant",
          amount: 22
        },
        {
          word: "Silly",
          amount: 11
        },
      ],
      //now comes the fact itself
      category: "Crime",
      image: "<source in base64 or something>",
      title: "Title of the fact",
      sourceCredebility: "CREDIBLE",
      source: "google.com",             //this one can be stored with the each fact I guess, fine. Even though it can be derived from the actual link
      description: "This is a sample description, don't take it too personally!!!",
      factLikes: 3333,
      factDislikes: 1111,
      originalAuthorId: 1234, //(or anonymouse if they choose)
      factId: 876789,
      //and maybe some other stuff, we'll see...
    },
  ]
}


// @route GET api/facts/search
// @desc This returns a search based off of the parameters 
// @access Private
router.get("/search", async (req, res) => {
  // console.log(req.query);
  let results = new Set();
  let keywords = getKeywordsFromText(req.query.q);
  for(let i = 0; i < keywords.length; i++) {
    let IDs = await searchFactIndex(req.query.q);
    for(let w of IDs) {
      results.add(w);
    }
  }
  results = Array.from(results);
  console.log("results:", results);
  
  //after all of that is done, retrieve the likes/dislikes from Redis
  let list = [];
  for(let i = 0; i < results.length; i++) {
    let activity = getFactActivity(results[i]);
    list.push({ id: results[i], activity: activity })
  }

  //TODO filter the query, make sure it's only alphanumeric characters
  return res.status(200).json({success: true, payload: "Testing endpoint", results });
});

// @route GET api/facts/youtube-video
// @desc This returns all the facts based on the id of the video
// @access Private
router.get("/youtube-video", isAuthenticated, (req, res) => {
  console.log("got here what...", req.query);
  //TODO filter the query, make sure it's only alphanumeric characters
  return res.status(200).json({success: true, payload: "Testing endpoint", video: youtubeVideoFacts});
});


// @route POST api/facts/fact
// @desc This endpoint creates a new fact
// @access Private
router.post("/fact", async (req, res) => {
  // console.log(req.body);
  let id = translator.generate(); //create UUID
  let date = new Date();
  let url = new Url(req.body.link);

  //TODO: validate input
  //(check that there is no link already, that's one dynamodb search)
  let fact = {
    id: id,                                       //generated short UUID (uuidv4 underneath)
    sort: "main",                                 //just the main sort key
    title: req.body.title,                        //set title
    link: req.body.link,                          //set link to what user provided
    // description: req.body.description,            //description of source/fact
    host: url.hostname,                           //extract the host name to show credebility
    archiveLink: "PENDING",                       //can be PENDING or FAILED, or the actual link...
    category: req.body.category,                  //self assigned category by the user
    date: date.toISOString(),                     //date in ISO format
    // author: req.user.id                           //user id
    author: "123"
  }

  if(await createFact(fact)) {
    res.status(200).json({ success: true, id });
  } else {
    res.status(200).json({ success: false, id });
  }

  //now index the fact's title + description
  // await createFactIndex({ id: id, keywords: getKeywordsFromText(fact.title + " " + fact.description) });
  await createFactIndex({ id: id, keywords: getKeywordsFromText(fact.title) });
  //then create an archive link
  let link = waybackSave + req.body.link;
  let waybackURL = await saveToWayback(link);
  //update the link in DynamoDB
  await updateArchiveLink(id, waybackURL);
  return;
});

// @route POST api/facts/fact-check
// @desc This endpoint creates a new fact-check for youtube
// @access Private
router.post("/fact-check", isAuthenticated, async (req, res) => {
  console.log(req.body);
  let id = translator.generate();
  let date = new Date();
  //TODO: validate all values
  //get the fact here...
  let findFact = {
    Key: {
      "id": {
        S: req.body.factId
      },
      "sort": {
        S: "main"
      }
    }, 
    TableName: "Fact"
  };

  let factReply = await dynamodb.getItem(findFact).promise();
  console.log("FactReply:", factReply);

  if(factReply.Item) {
    factReply = AWS.DynamoDB.Converter.unmarshall(factReply.Item);
  } else {
    return res.status(400).json({ success: false, error: "FACT_DOES_NOT_EXIST" });
  }

  let post = "";
  if(req.body.social === 'YT') {
    post = "yt-" + req.body.post;
  }

  //this requires a fact id, youtube video id, time (in seconds), sort of statement thing, quote, and quotee
  let factCheck = {
    id: post,
    factCheckId: id,
    sort: `${req.body.time}-${id}`,
    author: "123",
    factId: req.body.factId,
    time: req.body.time,
    quote: req.body.quote,
    quotee: req.body.quotee,
    date: date.toISOString(),
    likes: 0,
    dislikes: 0,
  }

  let addFactCheckParam = {
    Item: AWS.DynamoDB.Converter.marshall(factCheck),
    TableName: "FactCheck"
  }

  try {
    const data = await dynamodb.putItem(addFactCheckParam).promise();
    console.log("Success");
    console.log(JSON.stringify(data, null, 2));
    res.status(200).json({ success: true, id });
  } catch (err) {
    // console.log("failed adding fact");
    // console.log("Error", err)
    res.status(200).json({ success: false, id });
  } 
});


// @route GET api/facts/fact-checks
// @desc This endpoint returns all the fact checks for a certain post
// @access Private
router.get("/fact-checks", isAuthenticated, async (req, res) => {
  console.log("This:", req.query);
  let search = "";
  if(req.query.s === 'YT') {
    search = `yt-` + req.query.p;
  }
  var findFactChecks = {
    ExpressionAttributeNames: {
     "#I": "id"
    }, 
    ExpressionAttributeValues: {
     ":id": {
       S: search
      },
    },
    KeyConditionExpression: "#I = :id", 
    TableName: "FactCheck"
  }
  
  const result = await dynamodb.query(findFactChecks).promise();
  console.log(result);
  let factChecks = result.Items;
  for(let i = 0; i < factChecks.length; i++) {
    factChecks[i] = AWS.DynamoDB.Converter.unmarshall(factChecks[i]);
  }
  return res.status(200).json({ success: true, factChecks });
});


// @route GET api/facts/vote
// @desc This endpoint votes for a certain thingy...either upvotes or downvotes
//     fact={fact}, post={post}, factcheck={factcheck} (optional), vote={ "LIKE" | "DISLIKE" }
// @access Private
router.post("/vote", isAuthenticated, async (req, res) => {
  console.log("Query is:", req.query);
  console.log("Body is:", req.body);
  //if it is a fact that is being liked/disliked
  if(req.query.fact) {
    if(req.query.vote === "UP"){
      let result = await clickLikeFact("123", req.query.fact);
    }
  } else if(req.query.post && req.query.factcheck) {

  }
  return res.status(200).json({ success: true });
});


router.post("/delete-fact", async (req, res) => {
  //delete fact, retrieve values
  let fact = await deleteFact(req.body.id);
  console.log("fact after deleting...", fact);
  //delete fact index
  // await deleteFactIndex({ keywords: getKeywordsFromText(fact.title + " " + fact.description), id: fact.id });
  await deleteFactIndex({ keywords: getKeywordsFromText(fact.title + " " + fact.description), id: fact.id });
  //enter deletion into DeletedTables
  await recordFactDeletion(fact, "ADMIN_DELETE");
  return res.status(200).json({ success: true, fact });
});


return router;
}