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

// Static middleware pointing to the public folder
app.use(express.static("public"));

// We can send a body parameter to the client using the res.send() method. This body parameter can be a string, buffer, or even an array.

// Create Express.js routes for default '/' endpoint- Root Route
app.get("/", (req, res) => res.send("Navigate to /notes.html"));

// Create Express.js routes for '/notes' endpoint - Notes Route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// * I think I have to make a post request to the server to save the note to the db.json file ?
// app.post("/notes",

//! Is this correct? Is /api/notes the correct endpoint or is it redundant to /notes?
// Create Express.js routes for '/api/notes' endpoint - API Route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "db/db.json"))
);

// listen() method responsible for listening to incoming connections on a specific port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
