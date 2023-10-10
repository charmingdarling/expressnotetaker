// Import Express.js
const express = require("express");

// Import database file
const db = require("./db/db.json");

// Import built-in Node.js package 'path' to resolve path files that are located on the server
// Creating file paths from functions normalize all arguments into a single path string (ie: .join() merges the arguments together to construct the path string)
// Path to THIS file (server.js) is stored in __dirname (ie.path.join(__dirname, "public/notes.html") will return the path to the notes.html file, merging two paths together)
// path.resolve will return the absolute path to the notes.html file

//? Clarice: Harry Potter Moving Staircases Analogy

// path.dirname(__filename) = The Hogwarts Staircase, Options Galore (public, db, etc.)

// path.dirname is the path to the directory of the file, the floor of the current staircase
// Like if you're trying to go to Divination or Astrology, since they go to (/ = to) the same floor, you can just say "Divination" or "Astrology" instead of "path.CosmologyStaircase/Divination" or "path.CosmologyStaircase/Astrology"

// params is what is passed to the function, not the actual path itself, it gives you directions to the path - params is like the stairs
// path.join(__dirname, "public/notes.html") = Hogwarts moving staircase
// path.resolve(__dirname, "public/notes.html") = Forbidden 3rd floor Classroom
// "/public/" is the corridor
// "notes.html" is the classroom

const path = require("path");

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3002;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static middleware pointing to the public folder
// Because you declare the static middleware before your routes, Express will serve this file automatically and you do not have to declare a route for it in your application. (get/post/put/delete)
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
app.post("/api/notes", async (req, res) => {
  // Log POST request received
  console.info(`${req.method} request received to add a note`);
  // Prep a response object to send back to the client
  let responseToClient;

  // Check if there is a title and text in the request body
  if (req.body.title && req.body.text) {
    // parse the data to get an array of objects, reading the existing data you have in the db.json file
    const data = await fs.readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data); // array of objects
    // Create a new note object with the properties title, text, and id
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: db.length.toString(),
    };
    notes.push(newNote); // Push the new note object onto the existing array of note objects

    // Save/Write the updated array of note objects back to the db.json file
    await fs.writeFile("./db/db.json", JSON.stringify(notes));

    // Assign the db.json file to the response object
    responseToClient = {
      status: "success",
      body: newNote,
    };

    // Send the success response object back to client
    res.json(responseToClient);
  } else {
    let newNote;

    // If the request body is missing one of the two required properties, send a 400 error back to the client
    res
      .status(400)
      .json({ error: "Please enter a title and text for your note." });
  }
});

// listen() method responsible for listening to incoming connections on a specific port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
