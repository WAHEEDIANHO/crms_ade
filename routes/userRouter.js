const express = require("express");
const User = require("../models/user");
const forbiddenMethod = require("../controllers/forbiddenMethod");
const {
  addUser,
  deleteUserByID,
  getUserByID,
  getUsers,
  updateUserByID,
} = require("../controllers/userController");
const passport = require("passport");
const authenticate = require("../authenticate");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { verifyUser, verifyAdmin } = require("../authenticate");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function fileFilter(req, file, cb) {
    const mimetypes = /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
    // console.log(file.mimetype);
    if (!mimetypes.test(file.mimetype)) cb(null, false);
    else cb(null, true);
  },
  // limits: { fileSize: 4000 },
}).single("file");

const router = express.Router();

router.post("/signup", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ err: err.message, sucess: false });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ err: err.message, sucess: false });
    }
    // Handling data after image upload
    console.log(req.file);
    if (req.file !== undefined) {
      req.body.imageUrl = `uploads/${req?.file?.filename}`;
      req.body.username = req.body.email;
      req.body.password = "12345678";
      User.register(
        new User({ ...req.body }),
        req.body.password,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            // res.setHeader("Content-type", "application/json");
            console.log(err);
            fs.unlinkSync(`${__dirname}/../uploads/${req.file.filename}`);
            return res.json({ err: err });
          } else {
            passport.authenticate("local")(req, res, () => {
              console.log("from here");
              res.statusCode = 200;
              res.setHeader("Content-type", "application/json");
              return res.json({ success: true, status: "reg successful" });
            });
          }
        }
      );
    } else {
      // const err = new Error("Bad file type");
      res.status(400).json({ err: "Bad file", success: false });
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  console.log(authenticate.getUserId(token));
  res.statusCode = 200;
  res.setHeader("Content-type", "application/json");
  res.json({
    success: true,
    token: token,
    _id: req.user._id,
    status: "You are successfully loged in",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("session-id");
  res.send("Logout successsfully");
});

router.post("/change_password", verifyUser, (req, res) => {
  console.log(req.body);
  const { email, oldPassword, newPassword } = req.body;
  User.findByUsername(email)
    .then((user) => {
      console.log("ressetting password");
      user.changePassword(oldPassword, newPassword, (err) => {
        if (!err) {
          user.save();
          res.json({ success: true });
        } else {
          const err = new Error();
          err.message = "Error chnnage password";
          res.status(500).json({ err: err });
        }
      });
    })
    .catch((err) => res.status(500).json({ err: "user not find" }));
});

router
  .route("/")
  .get(verifyUser, getUsers)
  .post(forbiddenMethod)
  .put(forbiddenMethod)
  .delete(forbiddenMethod);

router
  .route("/:id")
  .get(verifyUser, getUserByID)
  .post(forbiddenMethod)
  .put(verifyUser, updateUserByID)
  .delete(verifyUser, verifyAdmin, deleteUserByID);

module.exports = router;
