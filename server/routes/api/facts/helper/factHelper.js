var AWS = require('aws-sdk');
const { default: axios } = require('axios');
const { deleteItemParams, putItemParams } = require('../../helperMethods/dynamoParams');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-2'});

const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object

//this simply retrieves the fact
const getFact = async (id) => {
  let factInfo = {
    id: id,
    sort: "main"
  }

  //get the info first
  var getFactParams = {
    Key: AWS.DynamoDB.Converter.marshall(factInfo),
    TableName: "Fact"
  }

  console.log("Params:", getFactParams);

  try {
    var fact = await dynamodb.getItem(getFactParams).promise();
    fact = AWS.DynamoDB.Converter.unmarshall(fact.Item);
  } catch(err) {
    console.log("Could not get the fact", err)
  }

  return fact;
}

const createFact = async (fact) => {
  let addFactParams =  {
    Item: AWS.DynamoDB.Converter.marshall(fact),
    TableName: "Fact"
  }

  try {
    const data = await dynamodb.putItem(addFactParams).promise();
    return true;
  } catch (err) {
    // console.log("failed adding fact");
    // console.log("Error", err)
    return false;
    res.status(200).json({ success: false, id });
  }


}

//must be called along with deleteFactIndex in order to remove it from the index
const deleteFact = async (id) => {
  //delete the factIndex
  let deleteFactIndexRecordParams = deleteItemParams(id, "main", "Fact", "ALL_OLD");
  try {
    var data = await dynamodb.deleteItem(deleteFactIndexRecordParams).promise();
    data = AWS.DynamoDB.Converter.unmarshall(data.Attributes);
  } catch(err) {
    console.log("Couldnt delete item:", err);
  }

  //update the deletedFacts + reason

  return data;
}

//delete the thing...
const recordFactDeletion = async (fact, reason) => {
  let date = new Date();
  let item = {
    ...fact,
    date: date.toISOString(),
    reason: reason
  }

  let recordDeleteParams = putItemParams(item, "DeletedFact");
  try {
    await dynamodb.putItem(recordDeleteParams).promise();
  } catch(err) {
    console.log("Couldnt record that item was deleted:", err);
  }
}

const saveToWayback = async (link) => {
  try {
    let res = await axios.get(link);    
    let headers = res.headers;
    let links = headers['link'].split(',');
    
    //if it doesn't change, keep as an error
    var waybackURL = "ERROR";
    
    //grab the wayback URL
    for(let i = 0; i < links.length; i++) {
      if(links[i].includes("rel=\"memento\"")) {
        waybackURL = links[i].substr(links[i].indexOf('<') + 1, links[i].indexOf('>') - 2);
        break;
      }
    }
  }
  catch(err) {
    console.log("failed getting the wayback URL...", err);
  }
  return waybackURL;
}

const updateArchiveLink = async (id, waybackURL) => {
  var updateWaybackURL = {
    ExpressionAttributeNames: {
      "#L": "archiveLink",
    },
    ExpressionAttributeValues: {
      ":l": { S: waybackURL },
    }, 
    Key: {
      "id": {
        S: id
      },
      'sort': {
        S: `main`
      }
    }, 
    TableName: "Fact", 
    UpdateExpression: "SET #L = :l"
  };

  try {
    await dynamodb.updateItem(updateWaybackURL).promise();
  } catch(err) {
    console.log("Could not update wayback URL", err);
  }
  return;
}

//get the likes/dislikes from the 
const getFactActivity = async (id) => {
  let data = await client.hmget(`${id}`, "l", "d");
}

module.exports = {
  getFact,
  createFact,
  deleteFact,
  recordFactDeletion,
  saveToWayback,
  updateArchiveLink,
  getFactActivity
}