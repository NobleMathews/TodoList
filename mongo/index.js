const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const uri = "mongodb+srv://heads:heads@cluster0-v6kuo.mongodb.net/test?retryWrites=true&w=majority";

// Database Name
const dbName = "test";

// Create a new MongoClient
const client = new MongoClient(uri);

// user schema = {
//     _id : ObjectID,
//     user_id : String,
//     pswd : String,
//     dob : String
//     }


// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  var auth =db.collection("user");
  var my_cursor=auth.find({user_id:"mathews"},{pswd:1,dob:1});
  
  client.close();
});