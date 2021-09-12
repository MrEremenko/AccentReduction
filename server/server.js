//Environmental variables
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const http = require('http');
const facts = require('./routes/api/facts/facts');
const user = require('./routes/api/user/user');
var cors = require('cors');

//redis stuff
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
const client = redis.createClient({
  port: +process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

//passport stuff
var app = express();
const server = http.createServer(app);
let passport = require('passport');
require('./config/configPassport')(passport);

// app.use(express.static(path.join(__dirname, 'client', 'build')));

// app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//craete passport store
app.use(session({
  store: new RedisStore({ client: client }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  name: "session",
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 1
  }
}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/api/facts', facts(passport));
app.use('/api/user', user(passport));
// app.use('/api/posts', posts());


// const rateLimit = require("express-rate-limit");
// app.get('*', function(req, res) {
//   res.sendFile('index.html', {root: path.join(__dirname, 'client', 'build')});
// });

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));

