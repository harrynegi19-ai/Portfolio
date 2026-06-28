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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: {
        rejectUnauthorized: false // This line is required for TiDB Cloud secure connections!
    },
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
    const { name, email, subject, message } = req.body;

    const sqlInsert = "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";
    
    db.query(sqlInsert, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error("Error inserting data into MySQL:", err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.status(201).json({ success: true, message: 'Message saved to MySQL successfully!' });
    });
});

// 3. Start the Server
// Change const PORT = 5000; to this:
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});