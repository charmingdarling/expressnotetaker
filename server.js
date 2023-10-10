// Import Express.js
const express = require("express");

// Import database file
const db = require("./db/db.json");

// Import built-in Node.js package 'path' to resolve path files that are located on the server
const path = require("path");

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3002;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static middleware pointing to the public folder
app.use(express.static("public"));

// We can send a body parameter to the client using the res.send() method. This body parameter can be a string, buffer, or even an array.

// Create Express.js routes for default '/' endpoint- Root Route
app.get("/", (req, res) => res.send("Navigate to /notes.html"));

// Create Express.js routes for '/notes' endpoint - Notes Route
// Create a get request for all `/notes` that logs when a user visits that route

// * Do I need to use /api/notes or just /notes? It doesn't work for /api/notes

// GET = Read
app.get("/notes", (req, res) => {
  console.info(`${req.method} request received to get notes`);
  // Sending all notes to client from db in json format (title and text)
  return res.json(db);
});

//! Is this correct? Is /api/notes the correct endpoint or is it redundant to /notes? Should I get rid of this?
// Create Express.js routes for '/api/notes' endpoint - API Route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "db/db.json"))
);

// * I think I have to make a post request to the server to save the note to the db.json file ?
// POST = Create
app.post("/api/notes", (req, res) => {
  // Log POST request recieved
  console.info(`${req.method} request received to add a note`);
  // Prep a response object to send back to the client
  let responseToClient;

  // Check if there is a title and text in the request body
  if (req.body.title && req.body.text) {
    // Create a new note object with the properties title, text, and id
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: db.length.toString(),
    };
    res.json(`Note for ${responseToClient.body.title} added successfully`);
  } else {
    res.json(`Error in adding note`);

    // Add the new note object to the db.json file
    db.push(newNote);

    // Assign the db.json file to the response object
    responseToClient = {
      status: "success",
      body: newNote,
    };

    // Log the response body to the console.
    console.log(responseToClient.body);

    // Send the response object back to the client
    res.json(responseToClient);
  }
  res.json(path.join(__dirname, "public/notes.html"));
});

// listen() method responsible for listening to incoming connections on a specific port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
