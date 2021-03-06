const path = require("path");
const crypto = require("crypto");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const createError = require("http-errors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const isAuthenticated = require("./middleware/isAuthenticated");
const MongoDBStore = require("connect-mongo")(session);
const moment = require("moment");

const { HOST = "localhost", PORT = 27017 } = process.env;
const ONE_WEEK = 60 * 24 * 7 * 60 * 1000;

mongoose.connect(
  `mongodb://${HOST}:${PORT}/facebook`,
  function(error) {
    if (!error) {
      console.log("Successfully connected to monogoDb.");
    }
  }
);

var app = express();

//Routes
const authenticationRouter = require("./routes/auth");
const signupRouter = require("./routes/signup");
const postRouter = require("./routes/posts");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: ONE_WEEK
    },
    store: new MongoDBStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", authenticationRouter);
app.use("/signup", signupRouter);
app.use("/user", isAuthenticated(), userRouter);
app.use("/posts", isAuthenticated(), postRouter);
app.use("/", isAuthenticated(), indexRouter);

app.locals.moment = moment;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
