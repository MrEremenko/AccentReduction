var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08', region: 'us-west-2' });


async function confirmUser(id, date) {
  //do a quick call to confirm the user:
  let confirmUserEmail = {
    ExpressionAttributeNames: {
        "#CD": "confirmedDate",
        "#CO": "confirmed",
    },
    ExpressionAttributeValues: {
        ":cd": { S: date.toISOString()},
        ":co": { BOOL: true },
    },
    Key: {
        "id": {
            S: id,
        },
        "sort": {
            S: `main`,
        },
    },
    ReturnValues: "ALL_NEW",
    TableName: "User",
    UpdateExpression: "SET #CD = :cd, #CO = :co",
  };

  try {
    const data = await dynamodb.updateItem(confirmUserEmail).promise();
  } catch (err) {
    console.log("Error confirming user...", err);
  }


}

module.exports = {
  confirmUser
}