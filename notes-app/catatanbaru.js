app.post('/notes', (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    db.query(sql, [title, datetime, note], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Note created', noteId: result.insertId });
    });
});
