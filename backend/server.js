const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'test_db'
});
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, name, description });
    });
});
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});
app.get('/items/:id', (req, res) => {
    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Item not found');
        res.status(200).send(results[0]);
    });
});
app.put('/items/:id', (req, res) => {
    const { name, description } = req.body;
    const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ id: req.params.id, name, description });
    });
});
app.delete('/items/:id', (req, res) => {
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Item deleted');
    });
});
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});


