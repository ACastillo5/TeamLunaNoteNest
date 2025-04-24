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

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = 3000;
const HOST = "localhost";

// Set up view engine
app.set("view engine", "ejs");

app.post('/upload', (req, res) => {
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
    store: new MongoStore({ mongoUrl: mongoUri }),
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
    // Redirect back to the upload page with a success flag
    res.redirect("/notes/upload?success=true");
  });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));
//ALL MONGODB STUFF
const mongUri = 'mongodb+srv://admin:admin123@cluster0.l5zpc.mongodb.net/notenest?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongUri)
  .then(() => {
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
      console.log("MongoDB connected");
    });
  })
  .catch(err => console.log(err.message))

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'jhkjhjhjhkhjhkoiuoiuio',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: new MongoStore({ mongoUrl: mongUri })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

//prints session
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  console.log("user session: " + req.session.user);
  console.log("local user var: " + res.locals.user);

  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});
//MONGODB END

//set up routes 
const { isLoggedIn } = require('./middlewares/auth');
app.post('/upload', (req, res) => {
  uploadWithMongoDB(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    // Redirect back to the upload page with a success flag
    res.redirect('/upload?success=true');
  });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  if (req.session.user && !req.body.prof) {
    return res.redirect("/studentHomePage");
  } else if (req.session.user && req.body.prof) {
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

app.get("/notes/search", (req, res) => {
  res.render("notes/search");
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
// Uncomment the following line when noteRoutes is complete
// app.use('/notes', noteRoutes);

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

  // Ensure the user context is available for the error page
  res.locals.user = req.session.user || null;

  res.status(err.status);
  res.render("error", { error: err });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

module.exports = app;