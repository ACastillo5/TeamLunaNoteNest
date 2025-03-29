const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/notes/preview.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/notes/search.html'));
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/notes/upload.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/user/login.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/user/profile.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/user/signup.html'));
});

app.get('/profHome', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/professor-home.html'));
});

app.get('/studentHome', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/student-home.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/user/test.html'));
});

app.get('/bookmarks', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/user/bookmarks.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;