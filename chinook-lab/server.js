const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("Chinook_Sqlite.sqlite");
const app = express();
app.use(express.json());

// Test route: list all tables in the database
app.get('/tables', (req, res) => {
    const stmt = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    res.json(stmt.all());
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

/* stuff I am adding */
//Part C Q1
app.get('/artists', (req, res) => {
    const stmt = db.prepare(
        "SELECT * FROM Artist"
    );
    res.json(stmt.all());
});

//Q2
app.get('/artists/:id/albums', (req, res) => {
    let id = req.params.id;
    const stmt = db.prepare(
        "SELECT * FROM Artist WHERE " + id + " == ArtistId"
    );
    res.json(stmt.all());
});

//Q3
app.get('/tracks/long', (req, res) => {
    const stmt = db.prepare(
        "SELECT Album.Title, Track.Name, Track.Milliseconds FROM Album JOIN Track ON Track.AlbumId == Album.AlbumId WHERE Track.Milliseconds > 300000"
    );
    res.json(stmt.all());
});

//Q4
app.get('/genres/:id/stats', (req, res) => {
    let id = req.params.id;
    const stmt = db.prepare(
        "SELECT Genre.Name AS GenreName, COUNT(*) AS NumTracks, AVG(Milliseconds)/1000 AS AvgLength FROM Genre JOIN Track ON Genre.GenreID == Track.GenreId GROUP BY Genre.Name"
    );
    res.json(stmt.all());
});

//Q5
app.post('/playlists', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "name is required" });
    }

    const stmt = db.prepare("INSERT INTO Playlist (Name) VALUES (?)");
    const result = stmt.run(name);
    
    res.status(201).json({
        id: Number(result.lastInsertRowid),
        name: name,
    });

    res.json(stmt.run());
});