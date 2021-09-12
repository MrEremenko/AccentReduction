var AWS = require('aws-sdk');
// var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-1'});

const deleteItemParams = (id, sort, table, returnValues) => {
  let key = {
    id,
    sort
  }

  let params = {
    Key: AWS.DynamoDB.Converter.marshall(key),
    TableName: table
  }
  
  if(returnValues)
    params["ReturnValues"] = returnValues;
  
  return params;
}

const putItemParams = (item, table) => {
  let params = {
    Item: AWS.DynamoDB.Converter.marshall(item),
    TableName: table
  }
  return params;
}

module.exports = {
  deleteItemParams,
  putItemParams
}