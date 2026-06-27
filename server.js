// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());          // Allows your frontend to talk to this backend
app.use(express.json());  // Parses incoming form data into JSON format

// 1. Configure the MySQL Connection Pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',             // Your MySQL username (default is 'root')
    password: '',             // Your MySQL password (leave blank for XAMPP, or type your custom password)
    database: 'portfolioDB',  // The name of your database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message);
    } else {
        console.log('✅ Connected successfully to MySQL Database');
        connection.release();
    }
});

// 2. Create the API Route to handle Form Submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const sqlInsert = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    
    db.query(sqlInsert, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting data into MySQL:", err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.status(201).json({ success: true, message: 'Message saved to MySQL successfully!' });
    });
});

// 3. Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});