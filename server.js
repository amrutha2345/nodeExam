const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql', // Replace with your MySQL password
  database: 'backend'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).send('Name and email are required');
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(`User added with ID: ${result.insertId}`);
  });
});
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Node.js + MySQL CRUD App</h1><p>Try accessing <a href="/users">/users</a> to see the user list.</p>');
  });

  app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
  });
app.post('/users/update/:id', (req, res) => {
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.send(`User with ID: ${req.params.id} updated`);
  });
});
app.post('/users/delete/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    res.send(`User with ID: ${req.params.id} deleted`);
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
