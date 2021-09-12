var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-1'});


const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST); // uses defaults unless given configuration object



const clickLikeFact = async (userId, factId) => {
  //several things here
  //first, retrieve the like/dislike status from redis pertinent to that user
  //second, update that value
  //third, update the like/dislike values for that fact
  const data = await client.hget(`${userId}:vote`, `${factId}`);
  console.log("vote status from user for fact:", data);
  console.log("Type of data:", typeof data);
  //if they already liked it, then remove it from their profile, and decrement the like for the fact
  if(data === "1") {
    const amountRemoved = await client.hdel(`${userId}:vote`, `${factId}`);
    console.log("amount deleted in client:", amountRemoved)
    const afterDec = await client.hincrby(`${factId}`, `l`, -1);
    console.log("fact amount after deleting:", amountRemoved);
    if(afterDec === 0) {
      await client.hdel(`${factId}`, `l`);
    }
  } else {
    console.log("does it really get here....");
    //This will happen either way, if data is null, or if it is a dislike
    //update user
    const amountAddedUser = await client.hset(`${userId}:vote`, `${factId}`, 1);
    //update fact
    const afterIncrementFact = await client.hincrby(`${factId}`, `l`, 1);
  
    //if it was a dislike, and we need to like, then just also decrement dislike in the fact
    if(data === -1) {
      const afterDecrementFact = await client.hincrby(`${factId}`, `d`, -1);
      if(afterDecrementFact === 0) {
        await client.hdel(`${factId}`, `d`);
      }
    }
  }

}

const clickDislikeFact = async (factId) => {
  const data = await client.hget(`${userId}:vote`, `${factId}`);
  console.log("vote status from user for fact:", data);
  //if they already disliked it, then remove it from their profile, and decrement the dislike for the fact
  if(data === -1) {
    const amountRemoved = await client.hdel(`${userId}:vote`, `${factId}`);
    const afterDec = await client.hincrby(`${factId}`, `d`, -1);
    if(afterDec === 0) {
      await client.hdel(`${factId}`, `d`);
    }
  } else {
    //This will happen either way, if data is null, or if it is a like
    //update user
    const amountAddedUser = await client.hset(`${userId}:vote`, `${factId}`, -1);
    //update fact
    const afterIncrementFact = await client.hincrby(`${factId}`, `d`, 1);
  
    //if it was a like, and we need to dislike, then just also decrement like in the fact
    if(data === 1) {
      const afterDecrementFact = await client.hincrby(`${factId}`, `l`, -1);
      if(afterDecrementFact === 0) {
        await client.hdel(`${factId}`, `l`);
      }
    }
  }
}


const clickLikeFactCheck = async (factId) => {
  let updateVotes = {
    ExpressionAttributeNames: {
      "#L": "likes"
    },
    ExpressionAttributeValues: {
      ":l": {
        "N": "1"
      }
    },
    Key: {
      "id": {
        S: factId
      }, 
      "sort": {
        S: "main"
      }
    },
    UpdateExpression: "SET #L = #L + :l",
    TableName: "Fact",
  }
  return await dynamodb.updateItem(updateVotes).promise();
}

const clickDislikeFactCheck = async (factId) => {
  let updateVotes = {
    ExpressionAttributeNames: {
      "#L": "likes"
    },
    ExpressionAttributeValues: {
      ":l": {
        "N": "1"
      }
    },
    Key: {
      "id": {
        S: factId
      }, 
      "sort": {
        S: "main"
      }
    },
    UpdateExpression: "SET #L = #L - :l",
    TableName: "Fact",
  }
  return await dynamodb.updateItem(updateVotes).promise();
}



module.exports = {
  clickLikeFact, clickDislikeFact
}