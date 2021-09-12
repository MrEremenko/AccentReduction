var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08', region: 'us-west-1'});


async function createNewUser(id, email, date, confirmationId, inviteCode) {
  //create the user
  // console.log('got here....');
  let item = {
      "id": { S: id },
      "sort": { S: "main" },
      "email": { S: email.toLowerCase() },
      "registeredAt": { S: date },
      "confirmationId": { S: confirmationId },
  };
  if (inviteCode) {
      item["initialInviteCode"] = { S: inviteCode };
  }
  let createUserParams = {
      Item: item,
      TableName: "User",
  };

  // console.log(JSON.stringify(createUserParams, null, 2));
  // Call DynamoDB
  try {
      await dynamodb.putItem(createUserParams).promise();
      //now update it in the other table...cool cool...
      await addEmailToDatabase(id, email)
  } catch (err) {
      console.log("Error", err);
  }
}

async function addEmailToDatabase(id, email) {
  let updateUser = {
    Item: {
        id: {
            S: email.toLowerCase(),
        },
        sort: {
            S: email.substring(email.indexOf("@")).toLowerCase(),
        },
        userId: {
            S: id,
        },
    },
    TableName: "EmailToUser",
  };
  // add email to the list of emails that is taken...
  try {
      await dynamodb.putItem(updateUser).promise();
  } catch (err) {
      console.log("Error", err);
  }
}

async function getPossibleUser(email) {
  var userExistParams = {
      ExpressionAttributeNames: {
          "#E": "id",
      },
      ExpressionAttributeValues: {
          ":e": {
              S: email.toLowerCase(),
          },
      },
      ConsistentRead: true,
      KeyConditionExpression: "#E = :e",
      TableName: "EmailToUser",
  };

  try {
      var possibleUser = await dynamodb.query(userExistParams).promise();
      console.log("Possible user:");
      console.log(possibleUser);
  } catch (err) {
      console.log("Error creating user", err);
  }

  return possibleUser;
}

function generateConfirmationId() {
  return require("crypto").randomBytes(64).toString("hex");
}

//email user
async function emailUser(confirmationId, email, userId) {
  //send email here
  let sentSuccess = false;

  var emailParams = {
      Destination: {
          ToAddresses: [email],
      },
      Message: { /* required */
          Body: { /* required */
              Html: {
                  Charset: "UTF-8",
                  Data: `Please confirm your account by clicking the link below:
       https://www.gradcent.com/join/${confirmationId}`,
              },
              Text: {
                  Charset: "UTF-8",
                  Data: `Please confirm your account by clicking the link below:
       https://www.gradcent.com/join/${confirmationId}`,
              },
          },
          Subject: {
              Charset: "UTF-8",
              Data: "Email Confirmation",
          },
      },
      Source: "verify@gradcent.com", /* required */
      ReplyToAddresses: ["verify@gradcent.com"],
  };

  try {
      const info = await ses.sendEmail(emailParams).promise();
      // console.log('Email sent: ' + JSON.stringify(info, null, 2));
      sentSuccess = true;
  } catch (err) {
      //TODO: notify/email me if I want to know about EVERY single failed email...could have been a typo...
      console.log("Failed sending email:", err);
  }

  if (sentSuccess)
      await updateEmailSent(userId, true, email);
}

async function updateEmailSent(userId, sent, email) {
  var emailSentParams = {
      ExpressionAttributeNames: {
          "#CES": "confirmationEmailSent",
      },
      ExpressionAttributeValues: {
          ":sent": {BOOL: sent},
      },
      Key: {
          "id": {
              S: userId,
          },
          "sort": {
              S: `emails#${email}`,
          },
      },
      ReturnValues: "ALL_NEW",
      TableName: "User",
      UpdateExpression: "SET #CES = :sent", //at 0 because that is the only email at that moment....yep smart smart...
  };

  try {
      const userData = await dynamodb.updateItem(emailSentParams).promise();
      console.log("Success, marked general email as sent");
  } catch (err) {
      console.log("failed adding student to institution:");
      // console.log("Error", err);
  }
}

async function savePassword(id, password) {
  console.log("ID AND PASS ARE:", id, password)
  var passwordParams = {
    Item: {
        id: {
            S: id,
        },
        hash: {
            S: await require("bcrypt").hash(password, 10),
        },
    },
    TableName: "PasswordHash",
  };
  try {
    const result = await dynamodb.putItem(passwordParams).promise();
    console.log("Saving password:", result);
  } catch(err) {
    return false;
  }
  return true;
}

module.exports = {
  createNewUser,
  getPossibleUser,
  generateConfirmationId,
  emailUser,
  updateEmailSent,
  savePassword
}