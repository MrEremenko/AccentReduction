require("dotenv").config({path:__dirname + '/../.env'});
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const { findUserByEmail, getHashById, compareHashes, findUserById, findUserByConfirmation, unmarshallObject, unmarshallArray, buildUser } = require("./Passport/passportHelper");

const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object


module.exports = passport => {
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, cb) {
        findUserByEmail(email, (err, data) => {        
          if(!data.Item || err) {
            return cb(err);
          }
          let userObject = unmarshallObject(data.Item);

          getHashById(userObject.userId, (err, hash) => {
            if(!hash.Item || err) {
              return cb(err);
            }
            hash = unmarshallObject(hash.Item);

            compareHashes(password, hash.hash, (err, isValid) => {
              if(err) {
                return cb(err);
              }
              
              if(isValid) {
                findUserById(userObject.userId, (err, possibleUser) => {
                  if(err) {
                    return cb(err)
                  }

                  if(possibleUser.Count == 0) {
                    return cb(null, false, {message: "user not found"});
                  } else {
                    //combine all things here...
                    var dataObjects = unmarshallArray(possibleUser.Items);
                    var user = buildUser(dataObjects);
                    return cb(null, user);
                  }
                });
              } else {
                return cb(null, false, { message: 'Incorrect Password' });
              }
            })
          });
        })
      }
    )
  );

  //accepts a confirmation id; since it is emailed to the exact person, and it is random, and 128 characters or so long,
  //Its safe so say its a password; so use it as a password and set that dam cookie!
  //All this route does is it sets a cookie for the user, because they're real;
  passport.use(
    'local-link-confirmation',
    new LocalStrategy({
          usernameField: 'username',
          passwordField: 'confirmationId'
        },
      function(username, password, done) {
        findUserByConfirmation(password, (err, possibleUser) => {
          if(err) {
            return done(err);
          }
          
          if(possibleUser.Count == 0) {
            return done(null, false, { error: "No such confirmationId" });
          }
          
          //combine all things here...
          var dataObjects = unmarshallArray(possibleUser.Items);
          
          //ok to build this since when user confirms initially, there's like 2 records per user...its ok its ok...
          var user = buildUser(dataObjects);
          return done(null, user);
        });
      }
    )
  );

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(async function(id, cb) {
    console.log("desezID", id);
    let user = { id };
    let status = await client.hgetall(`${id}`);
    console.log(status)
    if(status === null) {
      cb(null, false);
    } else {
      user["status"] = status;
      cb(null, user);
    }

    // findUserById(id, function(err, possibleUser) {
    //   if(err) {
    //     cb(err)
    //   }
    //   if(possibleUser.Count === 0) {
    //     cb(null, false);
    //   } else {
    //     //combine all things here...
    //     let dataObjects = unmarshallArray(possibleUser.Items);
    //     let user = buildUser(dataObjects);
    //     cb(null, user);
    //   }
    // });
  });
}
