require("dotenv").config({path:__dirname + '/../../.env'});
const express = require("express");
const router = express.Router();
const short = require('short-uuid');
const translator = short();
var AWS = require('aws-sdk');
const { default: axios } = require("axios");
const { getPossibleUser, generateConfirmationId, createNewUser, emailUser, savePassword } = require("./helper/registerHelper");
const { confirmUser } = require("./helper/confirmHelper");
AWS.config.update({region: 'us-west-2'});
const validateEmailInput = require("../../../validation/validEmail");

const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object

module.exports = (passport) => {

// @route POST api/user/register
// @desc This registers the user with the provided email, username and password
// @access Private
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateEmailInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
}
  let confirmationDate = new Date();
  
  //Form validation: TODO
  // const {errors, isValid} = validateRegisterInput(req.body);
  
  //Check validation
  // if (!isValid) {
  //     return res.status(422).json({success: false, error: "InvalidEmail"});
  // }
  
  const possibleUser = await getPossibleUser(req.body.email);
  //shouldn't be anything greater than 1 really...
  if (possibleUser.Count > 0) {
    return res.status(422).json({ success: false, error: "EmailInUse" });
  }

  //create confirmation id
  const confirmationId = generateConfirmationId();
  
  //create a uuidv4 id with short-uuid
  let userId = translator.generate();

  try {
    //create new user
    await createNewUser(userId, req.body.email, confirmationDate.toISOString(), confirmationId, req.body.invite ? req.body.invite : null);
  } catch (err) {
    return res.status(500).json({ success: false, error: "UserRegistrationFailed" });
  }
  
  if(!(await savePassword(userId, req.body.password))) {
    return res.status(500).json({ success: false, error: "SavingPasswordFailed" });
  }

  // await emailUser(confirmationId, req.body.email, userId);
  return res.status(200).json({success: true});
});

// @route POST api/user/confirm/
// @desc  Route to confirm the user has clicked on the link
// @access pretty private
router.post("/confirm", passport.authenticate("local-link-confirmation"), async (req, res) => {
  //confirm user, that's it really...
  let date = new Date();
  if(!req.user.confirmed) {
    await confirmUser(req.user.id, date);
    await client.hset(`${req.user.id}`, "status", "CONF");
  } else {
    return res.status(422).json({ message: "ALREADY_REGISTERED" });
  }
  //TODO: also check if the user was invited by someone, and if so, mark this in a table somewhere
  return res.status(200).json({success: true})
});


return router;
}