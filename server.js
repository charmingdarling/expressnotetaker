// Import Express.js
const express = require("express");

// Import uuid package to create unique ids for each note
// Need to specify the version of uuid to use
const { v4: uuidv4 } = require("uuid");

// Import database file
const db = require("./db/db.json");

// Import filestystem module to read/write to files
const fs = require("fs");

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

// GET route for index
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// res.sendFile(path.resolve(__dirname, "./public/notes.html"));

// GET route for notes page
app.get("/notes", (req, res) =>
  // res.sendFile(path.join(__dirname, "../notes.html"))
  res.sendFile(path.resolve(__dirname, "./public/notes.html"))
);

// // Create Express.js routes for default '/' endpoint- Root Route
// app.get("/", (req, res) => res.send("Navigate to /notes.html"));

// ? I need a path that will connect the paths

// app.status(404).send("404 Error: Page not found");

// Create Express.js routes for '/notes' endpoint - Notes Route
// Create a get request for all `/notes` that logs when a user visits that route

// * How do I get the notes to display on the page?

// GET = Read
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to get notes`);

  // Attempt to read the file and parse JSON
  try {
    // parse the data to get an array of objects, reading the existing data you have in the db.json file
    const data = fs.readFileSync("./db/db.json", "utf8");
    // Array of objects from the db.json file
    const notes = JSON.parse(data);
    // Sending all notes to client from db in json format (title and text)
    res.json(notes);
  } catch (error) {
    console.error("Error reading notes:", error);

    // Handle the error with an if-else statement

    // If there is an error, send a 500 error response to the client

    if (error.code === "ENOENT") {
      // Handle file not found error
      res.status(404).json({ error: "File not found" });
    } else {
      // Handle any other error
      res.status(500).json({ error: error.message });
    }
  }
});

// // Create Express.js routes for '/api/notes' endpoint - API Route
// app.get("/notes", (req, res) =>
//   res.sendFile(path.join(__dirname, "db/db.json"))
// );

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
    const data = fs.readFileSync("./db/db.json", "utf8");
    // Array of objects from the db.json file
    const notes = JSON.parse(data);

    // ? A La Clarice -
    // JSON Parse notes = [{title: "Test Title", text: "Test text", id: "0"}]
    // Pretend JSON.parse = cutting a fish to turn it into ingredients to cook with
    // JSON.stringify = cooking the ingredients to turn it into a meal
    // const ingredients = `{"stock": "fishBones", "fry": "rightFillet", "bake": "leftFillet"}`;
    // const recipe = JSON.parse(ingredients);
    // ?
    // JSON.parse = take apart the .json file/package to access the objects/components
    // const data = await fs.readFile("./db/db.json", "utf8"); (destructuring)
    // const notes = JSON.parse(data);
    // ?
    //
    // const newIngredient = {"grill": "cheeks"};
    // ingredients.push(newIngredient);
    // fs.writeFile("./db/db.json", JSON.stringify(ingredients)); (restructuring)

    // Create a new note object with the properties title, text, and id
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      // This creates a unique id for each note
      id: uuidv4(),
    };
    notes.push(newNote); // Push the new note object onto the existing array of note objects

    // Save/Write the updated array of note objects back to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));

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
