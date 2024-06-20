const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Get all notes
app.get('/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Get a single note by ID
app.get('/notes/:id', (req, res) => {
    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(404).send('Note not found');
        }
        res.json(result[0]);
    });
});

// Create a new note
app.post('/notes', (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    db.query(sql, [title, datetime, note], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(`Note added with ID: ${result.insertId}`);
    });
});

// Update an existing note by ID
app.put('/notes/:id', (req, res) => {
    const { title, datetime, note } = req.body;
    const noteId = req.params.id;
    const sql = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
    
    db.query(sql, [title, datetime, note, noteId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        res.send('Note updated successfully');
    });
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        res.send('Note deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
