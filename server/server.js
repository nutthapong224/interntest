const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const qrcode = require('qrcode');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use cors middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Check DB connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

// Route to shorten URL
app.post('/api/shorten', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortUrl = shortid.generate(); // Create a shortened URL

    // Save the original URL and short URL in the database
    const query = 'INSERT INTO urls (original_url, short_url) VALUES (?, ?)';
    connection.query(query, [url, shortUrl], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving to the database' });
        }
        res.json({ shortUrl, originalUrl: url });
    });
});

// Route to handle the redirect when the shortened URL is clicked
app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;

    // Query the database to find the original URL
    const query = 'SELECT original_url FROM urls WHERE short_url = ?';
    connection.query(query, [shortUrl], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Shortened URL not found' });
        }

        // Redirect to the original URL
        const originalUrl = results[0].original_url;
        res.redirect(originalUrl);
    });
});

// Route to generate QR code for a URL
app.post('/api/generate-qrcode', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    qrcode.toDataURL(url, (err, code) => {
        if (err) return res.status(500).json({ error: 'Error generating QR code' });
        res.json({ qrcode: code });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
