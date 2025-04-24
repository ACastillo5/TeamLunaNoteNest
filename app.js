const express = require("express");
const path = require("path");
const uploadWithMongoDB = require('./models/upload');
const morgan = require('morgan'); // use express() to log request details
const methodOverride = require('method-override'); // allows PUT & DELETE
const bodyParser = require('body-parser'); // parses text as JSON
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // show error messages
const bcrypt = require('bcrypt'); // password hasher
const session = require('express-session'); // store session ID

const userRoutes = require('./routes/userRoutes');
// const noteRoutes = require('./routes/noteRoutes');
// add this back when ./routes/noteRoutes is complete, if not, it returns an error

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
// require('dotenv').config();

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

app.get('/', (req, res) => {
  if (req.session.user && !req.body.prof) {
    return res.redirect('/studenthomepage');
  } else if (req.session.user && req.body.prof) {
    return res.redirect('/profhomepage');
  } else {
  res.render('index');
}
});

app.get("/studentHomePage", isLoggedIn, (req, res) => {
    res.render('student-home');
});

app.get("/profHomePage", isLoggedIn, (req, res) => {
    res.render("professor-home"); // Render professor-home.ejs
});


app.get("/notes/search", (req, res) => {
  res.render("notes/search"); // Render notes/search.ejs
});

app.get("/notes/upload", (req, res) => {
  res.render("notes/upload"); // Render notes/upload.ejs
});

app.get("/notes/preview", (req, res) => {
  res.render("notes/preview"); // Render notes/reports.ejs
});

app.get("/notes/reports", (req, res) => {
  res.render("notes/reports"); // Render notes/reports.ejs
});

//import schemas
app.use('/user', userRoutes);

// app.use('/notes', noteRoutes); 
// add this back when ./routes/noteRoutes is complete, if not, it returns an error

app.use((req, res, next) => {
  let err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = ("Internal Server Error");
  }

  // ensure the user context is available for the error page
  res.locals.user = req.session.user || null;

  res.status(err.status);
  res.render('error', { error: err });
});

module.exports = app;