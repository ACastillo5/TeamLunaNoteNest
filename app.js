const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homePage.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'aboutPage.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'accountPage.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginPage.html'));
});

app.get('/noteView', (req, res) => {
  res.sendFile(path.join(__dirname, 'notePreviewPage.html'));
});

app.get('/profHomePage', (req, res) => {
  res.sendFile(path.join(__dirname, 'professorHomePage.html'));
});

app.get('/studentHomePage', (req, res) => {
  res.sendFile(path.join(__dirname, 'studentHomePage.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'searchPage.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign_up_Page.html'));
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploadPage.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;