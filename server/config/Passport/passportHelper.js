var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08', region: 'us-west-2' });
const bcrypt = require('bcrypt');


function findUserByEmail(email, callback) {
  email = email.toLowerCase();
  var findUserIdByEmailParams = {
    Key: {
      "email": {
        S: email
      },
      "sort": {
        S: email.substring(email.indexOf('@'))
      }
    },
    TableName: "EmailToUser"
  };

  dynamodb.getItem(findUserIdByEmailParams, function(err, data) {
    callback(err, data);
  });
}

function getHashById(id, callback) {
  var getUserHashParams = {
    Key: {
      "id": {
        S: id
      }
    },
    TableName: "PasswordHash"
  }
  dynamodb.getItem(getUserHashParams, function(err, hash) {
    callback(err, hash)
  });
}

function compareHashes(provided, existing, callback) {
  bcrypt.compare(provided, existing, function(err, isValid) {
    callback(err, isValid);
  });
}

function findUserById(id, callback) {
  var findUserParams = {
    ExpressionAttributeNames: {
     "#I": "id",
    },
    ExpressionAttributeValues: {
     ":id": {
       S: id
      },
    },
    KeyConditionExpression: "#I = :id",
    TableName: "User"
  }

  dynamodb.query(findUserParams, function(err, possibleUser) {
    callback(err, possibleUser);
  });
}

function findUserByConfirmation(confirmation, callback) {
  var userParms = {
    IndexName: "confirmationId-index",
    ExpressionAttributeNames: {
     "#C": "confirmationId",
    },
    ExpressionAttributeValues: {
     ":c": {
       S: confirmation
      }
    },
    KeyConditionExpression: "#C = :c",
    TableName: "User"
  }
  dynamodb.query(userParms, (err, data) => {
    callback(err, data);
  });
}

function unmarshallObject(obj) {
  return AWS.DynamoDB.Converter.unmarshall(obj);
}

function unmarshallArray(arr) {
  let dataObjects = arr.map(item => {
    return AWS.DynamoDB.Converter.unmarshall(item);
  });
  return dataObjects;
}

function buildUser(dataObjects) {
  var user = {};
  //get ridof the sort key, add the rest of the data...id might be extra, but whatever...
  for(data of dataObjects) {
    let {id, sort, ...rest} = data;
    let path = data.sort.split("#");
    //if its the main config file
    if(path.length === 1 && path[0] === "main") {
      let { sort, ...mainRest} = data;
      user = {
        ...user,
        ...mainRest
      }
    } else {
      assign(user, path, rest)
    }
  }
  return user;
}


function assign(obj, keyPath, value) {
  let lastKeyIndex = keyPath.length - 1;
  let key;
  for (let i = 0; i < lastKeyIndex; ++i) {
    key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

module.exports = {
  findUserByEmail,
  getHashById,
  compareHashes,
  findUserById,
  findUserByConfirmation,
  unmarshallObject,
  unmarshallArray,
  buildUser
}