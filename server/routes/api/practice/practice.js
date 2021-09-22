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
    // console.log(data.toString());
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


return router;
}