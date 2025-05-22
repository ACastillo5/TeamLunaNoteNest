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
const File = require("./models/file");

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

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
app.use(express.static(path.join(__dirname, "public")));
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
const { isLoggedIn, isProf } = require("./middlewares/auth");


//GET index - send all files to user
app.get("/", (req, res) => {
  const u = req.session.user;

  if (u && !u.prof) {
    return res.redirect("/studentHomePage");
  } else if (u && u.prof) {
    return res.redirect("/profHomePage");
  } 
  return res.render("index");
});

// app.get("/", async (req, res, next) => {
//   const u = req.session.user;

//     try {
//       if (u && !u.prof) {
//         const files = await File.find({});
//         res.render('/studentHomePage', { files });
//       } else if (u && u.prof) {
//         const files = await File.find({});
//         res.render('/profHomePage', { files });
//         }
//     } catch (err) {
//       console.error('Error loading files:', err);
//       res.status(500).send('Internal Server Error');
//     }
    
//   return res.render("index");
// });

app.get("/studentHomePage", isLoggedIn, async (req, res) => {
  try {
    const files = await File.find({});
    res.render('student-home', { files });
  } catch (err) {
    console.error('Error loading files:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/profHomePage", isLoggedIn, isProf, async (req, res) => {
  try {
    const files = await File.find({});
    res.render('professor-home', { files });
  } catch (err) {
    console.error('Error loading files:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Import schemas
app.use("/user", userRoutes);
app.use("/notes", noteRoutes);

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