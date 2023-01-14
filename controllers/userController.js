const User = require("../models/user");
const { error } = require("./error");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) res.status(200).json({ success: true, data: users });
    else error("no user yet");
  } catch ({ message }) {
    res.status(500).json({ success: false, msg: error });
  }
};

const addUser = async (req, res) => {
  const props = Object.keys(User.schema.obj);
  try {
    if (props.length === Object.keys(req.body).length) {
      const user = await User.create(req.body);
      res.status(200).json({ sucess: true, data: user });
    } else {
      const empty = props.filter((prop) => !req.body.hasOwnProperty(prop));
      error(empty);
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error });
  }
};

const getUserByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (user) res.status(200).json({ sucess: true, data: user });
    else error(`No entry match userId: ${id}`);
  } catch (error) {
    res.status(404).json({ sucess: false, msg: error });
  }
};

const updateUserByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const update_user = await User.findByIdAndUpdate(id, req.body);
    if (!update_user) error("no user updated");
    res.status(200).json({ sucess: true, id });
  } catch ({ message }) {
    console.log(message);
    res.status(500).json({ success: false, message });
  }
};

deleteUserByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const delete_user = await User.findByIdAndDelete(id);
    if (!delete_user) error();
    res.status(200).json({ sucess: true, id });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

module.exports = {
  getUsers,
  addUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
};
