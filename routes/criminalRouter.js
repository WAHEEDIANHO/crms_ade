const {
  getCriminals,
  addCriminal,
  getCriminalByID,
  updateCriminalID,
  deleteCrimalByID,
} = require("../controllers/criminalControllers");
const forbiddenMethod = require("../controllers/forbiddenMethod");
const express = require("express");
const { verifyUser, verifyAdmin } = require("../authenticate");

const router = express.Router();

router
  .route("/")
  .get(getCriminals)
  .post(verifyUser, addCriminal)
  .put(forbiddenMethod)
  .delete(forbiddenMethod);

router
  .route("/:id")
  .get(verifyUser, getCriminalByID)
  .post(forbiddenMethod)
  .put(verifyUser, updateCriminalID)
  .delete(verifyUser, verifyAdmin, deleteCrimalByID);

module.exports = router;
