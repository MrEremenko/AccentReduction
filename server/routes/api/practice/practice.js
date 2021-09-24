require("dotenv").config({path:__dirname + '/../../.env'});
const express = require("express");
const router = express.Router();
const short = require('short-uuid');
var AWS = require('aws-sdk');
const { default: axios } = require("axios");
const multer  = require('multer');
AWS.config.update({region: 'us-west-2'});
const validateEmailInput = require("../../../validation/validEmail");
var FileWriter = require('wav').FileWriter;
var fs = require("fs");
var ContentStream = require('contentstream');
const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object
var mic = require('mic');
var ffmpeg = require("ffmpeg");
const utf8 = require("utf8");
var spawn = require("child_process").spawn;
const { exec } = require("child_process");
const { getPresignedPost } = require("./helper/presignedPost");
const storage = multer.diskStorage({
  destination: "./audio/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.fieldname + '.wav')
  }
});

// const storage = multer.memoryStorage()


const upload = multer({ 
  storage,
  limits : { fileSize : 1000000 }
});

module.exports = (passport) => {

// @route POST api/practice/sentence
// @desc This registers the user with the provided email, username and password
// @access Private
router.post("/sentence", upload.single("sentence"), async (req, res) => {
  console.log("Received:", req.file);
  // console.log("buffer", req.file.buffer)
  // var outputFileStream = new FileWriter('./audio/test.wav', {
  //   data: Buffer.from(new Uint8Array(req.file.buffer))
  // });
  // outputFileStream.write(Buffer.from(new Uint8Array(req.file.buffer)));

  // fs.writeFileSync(outputFileStream, Buffer.from(new Uint8Array(req.file.buffer)));
  let pronounciation = '';
  var py = spawn("python", ["./recognizer/phonemeRecognizer.py", req.file.destination, req.file.filename]);

  // exec(`python ./recognizer/phonemeRecognizer.py ${req.file.destination} ${req.file.filename}`, function (err, stdout, stderr) {
  //   console.log(stderr);
  //   console.log(stdout);
  // });

  py.stdout.on('data', (data) => {
    pronounciation += data.toString();
  });

  py.stderr.on("data", data => {
    console.log(data.toString());
  })

  py.stdout.on('end', () => {
    console.log("Pronounciation ˠ =", pronounciation);
    // pronounciation = utf8.decode(pronounciation);
    // pronounciation = Buffer.from(pronounciation, 'utf-8').toString();
    // console.log("This", utf8.encode("\xc9\x99"));
    // console.log("and that", utf8.encode("\xc9\xb9\xcc\xa9"));

    // pronounciation = pronounciation.toString().replaceAll(/(\\x\w\w){1,4}/g, x => { 
    //   console.log(x)
    //   return utf8.encode(x)
    // });
    console.log("Pronounciation ˠ =", pronounciation);
    return res.status(200).json({ success: true });
  })

});

// @route POST api/practice/presigned-post
// @desc This returns a presigned-post
// @access Private
router.post("/presigned-post", async (req, res) => {
  const data = await getPresignedPost(Date.now() + "");
  console.log("Data is:", data);
  return res.status(200).json({ success: true, data });
});


// @route GET api/practice/pronounciation
// @desc This returns the pronounciation based on the text and the name of the audio file
// @access Private
router.post("/pronounciation", async (req, res) => {
  //first check if there is a sentence, and a name for the file that was uploaded
  if(!req.body.sentence) {
    return res.status(400).json({ error: true, message: "No sentence provided" })
  }
  if(!req.body.file) {
    return res.status(400).json({ error: true, message: "No filename provided" })
  }
  //if both are valid, send it to the python server
  console.log("About to hit the python server");
  axios.post('http://localhost:3001/pronounciation', { sentence: req.body.sentence, file: req.body.file })
  .then(response => {
    console.log("Python server returned:", response.data);
    return res.status(200).json({ success: true, response: response.data });
  })
  .catch(e => {
    console.log(e);
    return res.status(400).json({ success: false, message: "detecting pronounciation didn't work" });
  });
});




return router;
}