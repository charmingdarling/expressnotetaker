// Import Express.js
const express = require("express");

// Import built-in Node.js package 'path' to resolve path files that are located on the server
const path = require("path");

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3002;

// Static middleware pointing to the public folder
app.use(express.static("public"));

// Create Express.js routes for default '/' endpoint
app.get("/", (req, res) => res.send("Navigate to /notes.html"));

// Create Express.js routes for '/notes' endpoint
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// listen() method responsible for listening to incoming connections on a specific port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
