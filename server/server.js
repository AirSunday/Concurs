const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require("cookie-parser");
const passportConfig = require("./app/config/passport");
const sequelize = require("./app/models/index").sequelize;
const multer  = require("multer");

require("./app/models/person.model.js");
require("./app/models/session.model.js");

app.use(
  cors({
    origin: [
      "https://whoisa.ru",
      // 'http://localhost:8081',
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Origin", "https://whoisa.ru");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({dest:"app/uploads"}).array('files', 5));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Nastya app" });
});
require("./app/routes/concurs.routes.js")(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

passportConfig(passport);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
    },
    store: new SequelizeStore({
      db: sequelize,
      table: "sessionsdbs",
      logging: false,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/sign-in", require("./app/controllers/sign-in"));
app.post("/api/sign-out", require("./app/controllers/sign-out"));

const db = require("./app/models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
