/* Dependecies */
const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);

/* Express */
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Array of note Objects
const notes = [];

/* HTML Routes */
// homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// bad url
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
// serve local CSS and JS files (mad Googling to get this right!)
app.get("/assets/css/style.css", (req, res) => {
    res.sendFile(path.join(__dirname + "/assets/css/style.css"));
});

app.get("/assets/js/index.js", (req, res) => {
    res.sendFile(path.join(__dirname + "/assets/js/index.js"));
});

/* API Routes */
// .get any saved notes
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        // temp array for notes
        let holdNote = [];
        if (err) throw err;
        // if there's at least one note, send it, else no notes
        if (data.length > 0) {
            holdNote = JSON.parse(data);
            res.send(holdNote);
        }
        else {
            console.log("Nothing to see here.");
        }
    })
});

// .post a new note
app.post("/api/notes", (res, req) => {
    let newNote = req.body;
    console.log(newNote);
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        // if db already contains notes
        else if (data.length > 0) {
            // grab the old notes & parse; push new note, writeFile
            let oldNotes = JSON.parse(data);
            oldNotes.push(newNote);
            fs.writeFile("./db/db.json", data, (err) => {
                if (err) throw err;
                console.log("Note saved.");
            });
        }
        // else empty db, add first note
        else {
            let addNote = [];
            JSON.parse(newNote);
            addNote.push(newNote);
            fs.writeFile("./db/db.json", data, (err) => {
                if (err) throw err;
                console.log("Note saved.");
            });
        }
        // let newNote = JSON.stringify(data);
        // console.log(newNote);
        notes.push(newNote);
    });
});

// .delete a note
app.delete("/api/notes/:id", (res, req) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let currentNotes = JSON.parse(data);
        for (let note of currentNotes) {
            if (req.params.id === currentNotes[note].id) {
                currentNotes.splice(note, 1);
            }
            else {
                console.log("That ID does not exist.")
            }
        }
        const output = fs.writeFile("./db/db.json", JSON.stringify(currentNotes), (err) => {
            if (err) throw err;
            console.log("Notes updated.");
        })
        res.send(output);
    })
});

// Listen
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});