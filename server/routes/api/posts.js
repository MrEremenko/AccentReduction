require("dotenv").config({path:__dirname + '/../../.env'});
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid');
const translator = short();
var AWS = require('aws-sdk');
const { default: axios } = require("axios");
AWS.config.update({region: 'us-west-2'});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-2'});

// const Redis = require("ioredis");
// const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object

module.exports = (passport) => {

// @route GET api/facts/youtube-video
// @desc This returns all the facts based on the id of the video
// @access Private
router.get("/youtube-video", (req, res) => {
  console.log(req.query);
  //TODO filter the query, make sure it's only alphanumeric characters
  return res.status(200).json({success: true, payload: "Testing endpoint", video: youtubeVideoFacts});
});


// @route POST api/facts/create-post
// @desc This endpoint creates a new fact
// @access Private
return router;
}