var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = express();
app.use(cors());
app.use(express.json()); // Parse JSON in the request body

var CONNECTION_STRING = "mongodb+srv://admin:Kudoten69@cluster0.ufl3jd6.mongodb.net/?retryWrites=true&w=majority";
var DATABASE_NAME = "todoappdb";
var database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      console.error("Mongo DB Connection Error:", error);
    } else {
      database = client.db(DATABASE_NAME);
      console.log("Mongo DB Connection Successful");
    }
  });
});

app.get('/api/todoapp/GetNotes', (request, response) => {
  database.collection("todoappcollection").find({}).toArray((error, result) => {
    if (error) {
      console.error("Error fetching notes:", error);
      response.status(500).json({ error: "Internal server error" });
    } else {
      response.json(result);
    }
  });
});

app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
  database.collection("todoappcollection").countDocuments({}, function (error, numOfDocs) {
    database.collection("todoappcollection").insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes
    }, (error, result) => {
      if (error) {
        console.error("Error adding notes:", error);
        response.status(500).json({ error: "Internal server error" });
      } else {
        response.json("Added Successfully");
      }
    });
  });
});

app.delete('/api/todoapp/DeleteNotes', (request, response) => {
  database.collection("todoappcollection").deleteOne({
    id: request.query.id
  }, (error, result) => {
    if (error) {
      console.error("Error deleting note:", error);
      response.status(500).json({ error: "Internal server error" });
    } else {
      response.json("Delete Successfully");
    }
  });
});
