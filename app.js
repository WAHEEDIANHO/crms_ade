const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
const { criminalRouters, userRouter } = require("./routes");
const passport = require("passport");


require("dotenv").config();
const api = process.env.API_URL;

const app = express();
const PORT = process.env.PORT || 7700;

// Middlewares
// app.options("*", cors());
// app.use(cors());
app.use(function (req, res, next) {
  //Enabling CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

app.use(cors())
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/${api}/uploads`, express.static(`${__dirname}/uploads`));
// app.use(
//   session({
//     secret: "45634-986yt-765-6324mhy",
//     saveUninitialized: false,
//     resave: false,
//     name: "session-id",
//     store: FileStore(),
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect(process.env.ONLINE, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once("connected", () => {
  console.log("conected successfully to database");
  app.listen(PORT, () => console.log("app listenig o port on ", PORT));
})
  .on("error", (err) => {
    console.log(err);
  })
  .once("disconnected", () => {
    console.log("database disconnected");
  });

app.use(`/${api}/user`, userRouter);
app.use(`/${api}/criminal`, criminalRouters);
app.use((err, req, res, next) => {
  // console.log(err);
  res.status(500).json({ err: "server error" });
});


