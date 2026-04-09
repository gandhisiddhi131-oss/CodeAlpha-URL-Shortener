const express = require("express");
const mysql = require("mysql2");
const shortid = require("shortid");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@2006",
  database: "urlshortener"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("MySQL Connected");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("URL Shortener Server Running");
});

// API to create short URL
app.post("/shorten", (req, res) => {

  const originalUrl = req.body.originalUrl;

  const shortCode = shortid.generate();

  const sql = "INSERT INTO urls (original_url, short_code) VALUES (?, ?)";

  db.query(sql, [originalUrl, shortCode], (err, result) => {

    if (err) {
      return res.send("Error saving URL");
    }

    res.send({
      shortUrl: `http://localhost:3000/${shortCode}`
    });

  });

});

// Redirect short URL
app.get("/:code", (req, res) => {

  const code = req.params.code;

  const sql = "SELECT original_url FROM urls WHERE short_code=?";

  db.query(sql, [code], (err, result) => {

    if (result.length > 0) {
      res.redirect(result[0].original_url);
    } else {
      res.send("URL not found");
    }

  });

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});