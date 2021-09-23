require("dotenv").config();

// aws.config.loadFromPath(__dirname + '/creds.json');
var AWS = require("aws-sdk");
AWS.config.update({region: "us-west-2"});
const {v4: uuidv4} = require("uuid");

const S3_BUCKET = process.env.S3_BUCKET;
//THIS IS PURELY FOR UPLOADING PICTURES...possibly...maybe also anything really...
//the uuid is going to be either--a chat (from a chatrepo), an individualChatId (which is actually two chats...hmm...., maybe do another method for that),
//or a tutoring session uuid; so only the first and third for now.
function createPresignedPost(key) {
    const s3 = new AWS.S3({apiVersion: "2006-03-01", region: "us-west-2"}); //new s3 instance
    let CONTENT_TYPE = "audio/wav";
    const s3Params = {
        Bucket: S3_BUCKET,
        Expires: 60,
        Fields: {
          "Content-Type": CONTENT_TYPE,
          key: key,
        },
        Conditions: [
            // ["eq", "$acl", "public-read"],
            // ["eq", "$x-amz-meta-filename", key],
            ["content-length-range", 1, 1000000], //1MB
        ],
    };

    return new Promise(async (resolve, reject) => {
      s3.createPresignedPost(s3Params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
}

module.exports.getPresignedPost = async (key) => {
  try {
    const presignedPostData = await createPresignedPost(key);
    return { error: false, presignedPostData }
  } catch(e) {
    return { error: true };
  }
}
