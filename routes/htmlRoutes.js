/* Dependencies */
const path = require("path");

/* HTML Routes */
module.exports = (app) => {
    // homepage
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // notes
    app.get("/notes", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    // bad url
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    })
};