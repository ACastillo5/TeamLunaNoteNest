const express = require("express");
const path = require("path");
const morgan = require("morgan"); // Logs request details
const methodOverride = require("method-override"); // Allows PUT & DELETE
const bodyParser = require("body-parser"); // Parses text as JSON
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Displays error messages
const bcrypt = require("bcrypt"); // Password hasher
const session = require("express-session"); // Stores session ID
const uploadWithMongoDB = require("./models/upload");
const File = require("./models/file");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;
const HOST = "localhost";

// Set up view engine
app.set("view engine", "ejs");

// MongoDB connection
const mongoUri = 'mongodb://localhost:27017/NoteNest';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "jhkjhjhjhkhjhkoiuoiuio",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({ mongoUrl: mongoUri }),
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// Print session details
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  console.log("User session:", req.session.user);
  console.log("Local user variable:", res.locals.user);

  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

// Routes
const { isLoggedIn } = require("./middlewares/auth");

app.post("/upload", (req, res) => {
  uploadWithMongoDB(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.redirect("/notes/upload?success=true");
  });
});

app.get("/notes/search", async (req, res) => {
  const searchQuery = req.query.q || "";
  try {
    const results = await File.find({
      $or: [
        { filename: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in filename
        { course: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in course
        { professor: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in professor
        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
      ],
    });

    // Render the search page with the results
    res.render("notes/search", { results, searchQuery });
  } catch (err) {
    console.error("Error searching files:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  if (req.session.user && !req.session.prof) {
    return res.redirect("/studentHomePage");
  } else if (req.session.user && req.session.prof) {
    return res.redirect("/profHomePage");
  } else {
    res.render("index");
  }
});

app.get("/studentHomePage", isLoggedIn, (req, res) => {
  res.render("student-home");
});

app.get("/profHomePage", isLoggedIn, (req, res) => {
  res.render("professor-home");
});

app.get("/notes/upload", (req, res) => {
  res.render("notes/upload");
});

app.get("/notes/preview", (req, res) => {
  res.render("notes/preview");
});

app.get("/notes/reports", (req, res) => {
  res.render("notes/reports");
});

app.get("/bookmarks", (req, res) => {
  res.render("user/bookmarks");
});

app.get("/reports", (req, res) => {
  res.render("notes/reports");
});

app.get("/login", (req, res) => {
  res.render("user/login");
});

app.get("/profile", (req, res) => {
  res.render("user/profile");
});

app.get("/signup", (req, res) => {
  res.render("user/signup");
});

app.get("/test", (req, res) => {
  res.render("user/test");
});

// Import schemas
app.use("/user", userRoutes);

// Error handling
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.locals.user = req.session.user || null;

  res.status(err.status);
  res.render("error", { error: err });
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

module.exports = app;