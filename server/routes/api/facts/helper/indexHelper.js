var AWS = require('aws-sdk');
const { deleteItemParams } = require('../../helperMethods/dynamoParams');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-2'});

//this method takes in some text, namely a title or a description, and returns the array of
//unrepeated, greater than 2 chars long words, which will be indexed into the database
//the text shall be split by whitespace and select characters such as '&', '-', '+', '/'
const getKeywordsFromText = (text) => {
  let reg = /[\s-&+/]+/;
  let arr = text.split(reg).map(word => {
      return word.toLowerCase();
  });
  arr = arr.filter(word => word.length > 2);
  // console.log("arr after split and to lower:", arr);
  let set = new Set(arr);     //remove duplicates
  // console.log("set:", set)
  arr = Array.from(set);             //put back into array
  // console.log("back to arr:", arr);
  return arr;
}

//this takes in the keywords and saves it into
const createFactIndex = async ({id, keywords}) => {
  //save the keywords in DynamoDB
  for(let i = 0; i < keywords.length; i++) {
    let keyword = {
      id: keywords[i],
      sort: id
    }
  
    let addKeywordParams = {
      Item: AWS.DynamoDB.Converter.marshall(keyword),
      TableName: "FactIndex"
    }
  
    try {
      const data = await dynamodb.putItem(addKeywordParams).promise();
      console.log("success putting", keywords[i], "in. Res:", data);
    } catch (err) {
      //TODO: do clean up here? or what does one do?
      console.log("Ok, not goot....clean up (delete) or retry putting");
    }
  }

  //no need to save likes/dislikes in redis, that can be queried from aws...
}

//provide the keywords and factId, and it will remove with a loop
const deleteFactIndex = async ({ id, keywords }) => {


  for(let i = 0; i < keywords.length; i++) {
    let deleteFactIndexRecordParams = deleteItemParams(keywords[i], id, "FactIndex");
    try {
      const data = await dynamodb.deleteItem(deleteFactIndexRecordParams).promise();
      console.log("success deleting", keywords[i], "in. Res:", data);
    } catch(err) {
      //TODO: idk notify someone or cry
      console.log("ERROR deleting fact index");
    }

  }
}

//create a search for a single index
const searchFactIndex = async (word) => {
  var findFactChecks = {
    ExpressionAttributeNames: {
     "#I": "id"
    }, 
    ExpressionAttributeValues: {
     ":id": {
       S: word
      },
    },
    KeyConditionExpression: "#I = :id", 
    TableName: "FactIndex"
  }
  
  try {
    var result = await dynamodb.query(findFactChecks).promise();
    result = result.Items;
    for(let i = 0; i < result.length; i++) {
      result[i] = AWS.DynamoDB.Converter.unmarshall(result[i])["sort"];
    }
  
  } catch(err) {
    console.log("Couldn't retrieve from index:", err);
  }
  return result;
}

const getFactActivity = async (factId) => {

}

module.exports = {
  getKeywordsFromText,
  createFactIndex,
  deleteFactIndex,
  searchFactIndex,
  getFactActivity
}