/* Dependecies */
const fs = require("fs");

/* API Routes */
module.exports = (app) => {
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
                res.send(holdNote);
            }
        })
    });
    // .post a new note
    app.post("/api/notes", (req, res) => {
        let newNote = req.body;
        fs.readFile('./db/db.json', (err, data) => {
            let oldNotes;
            if (err) throw err;
            // if db already contains notes
            else if (data.length > 0) {
                // hold parsed data in var
                oldNotes = JSON.parse(data);;
                // push newNote
                oldNotes.push(newNote);
                console.log(oldNotes);
                // write to file
                fs.writeFile("./db/db.json", JSON.stringify(oldNotes), (err) => {
                    if (err) throw err;
                    console.log("Note saved.");
                });
            }
            // empty db? this doesn't display until data.length > 1 
            else if (data.length == 0) {
                let addNote = [];
                addNote.push(newNote);
                fs.writeFile("./db/db.json", JSON.stringify(addNote), (err) => {
                    if (err) throw err;
                    console.log("Note saved.");
                });
            }
            // respond to index.js functions
            res.json(oldNotes);
        })
    });
    // .delete a note
    app.delete("/api/notes/:id", (req, res) => {
        fs.readFile("./db/db.json", (err, data) => {
            if (err) throw err;
            let currentNotes = JSON.parse(data);
            // for-in loop through object, splicing out the clicked note
            for (let note in currentNotes) {
                if (req.params.id === currentNotes[note].id) {
                    currentNotes.splice(note, 1);
                }
                else {
                    console.log("That ID does not exist.")
                }
            }
            fs.writeFile("./db/db.json", JSON.stringify(currentNotes), (err) => {
                if (err) throw err;
                console.log("Notes updated.");
            })
            res.send(currentNotes);
        })
    })
}

// // working on some way to add id to app.post
//     addIds = oldNotes.map((note, index) => {
//         note.id = index;
//     });
// });