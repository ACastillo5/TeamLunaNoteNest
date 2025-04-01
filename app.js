const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/search", (req, res) => {
  res.render("notes/search"); // Render notes/search.ejs
});

app.get("/upload", (req, res) => {
  res.render("notes/upload"); // Render notes/upload.ejs
});

app.get("/login", (req, res) => {
  res.render("user/login"); // Render user/login.ejs
});

app.get("/profile", (req, res) => {
  res.render("user/profile"); // Render user/profile.ejs
});

app.get("/signup", (req, res) => {
  res.render("user/signup"); // Render user/signup.ejs
});

app.get("/profHomePage", (req, res) => {
  res.render("professor-home"); // Render professor-home.ejs
});

app.get("/studentHomePage", (req, res) => {
  res.render("student-home"); // Render student-home.ejs
});

app.get("/test", (req, res) => {
  res.render("user/test"); // Render user/test.ejs
});

app.get("/bookmarks", (req, res) => {
  res.render("user/bookmarks"); // Render user/bookmarks.ejs
});

app.get("/reports", (req, res) => {
  res.render("notes/reports"); // Render notes/reports.ejs
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;