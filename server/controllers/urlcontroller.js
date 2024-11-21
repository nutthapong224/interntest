const db = require("../db/connection");

// Create a Short URL
exports.createShortUrl = (req, res) => {
  const { fullUrl } = req.body;
  const shortCode = Math.random().toString(36).substring(2, 8);

  const query = "INSERT INTO urls (full_url, short_code) VALUES (?, ?)";
  db.query(query, [fullUrl, shortCode], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ fullUrl, shortUrl: `http://localhost:5000/${shortCode}` });
  });
};

// Get URL History with Pagination
exports.getHistory = (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM urls LIMIT ? OFFSET ?";
  db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
};

// Redirect to Original URL and Track Clicks
exports.redirectToUrl = (req, res) => {
  const { shortCode } = req.params;
  const query = "SELECT full_url FROM urls WHERE short_code = ?";
  db.query(query, [shortCode], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(404).send("URL not found");
    }

    // Log the click details
    const clickQuery = "INSERT INTO clicks (short_code, ip, user_agent) VALUES (?, ?, ?)";
    db.query(clickQuery, [shortCode, req.ip, req.headers["user-agent"]]);

    res.redirect(results[0].full_url);
  });
};

// Search URLs
exports.searchUrls = (req, res) => {
  const { query } = req.query;
  const sql = "SELECT * FROM urls WHERE full_url LIKE ? OR short_code LIKE ?";
  db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
};

// Update a Short URL
exports.updateUrl = (req, res) => {
  const { id } = req.params;
  const { fullUrl } = req.body;

  const query = "UPDATE urls SET full_url = ? WHERE id = ?";
  db.query(query, [fullUrl, id], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "URL updated successfully" });
  });
};

// Delete a Short URL
exports.deleteUrl = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM urls WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "URL deleted successfully" });
  });
};
