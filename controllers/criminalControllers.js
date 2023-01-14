const Criminal = require("../models/criminals");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/criminals"),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});

const upload = multer({
  storage: storage,
  fileFilter: function fileFilter(req, file, cb) {
    const mimetypes = /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
    // console.log(file.mimetype);
    if (!mimetypes.test(file.mimetype)) cb(null, false);
    else cb(null, true);
  },
}).single("file");

getCriminals = async (req, res) => {
  // console.log(req.headers);
  try {
    const criminals = await Criminal.find({});
    if (!criminals) throw new Error("no criminal");
    res.status(200).json({ success: true, data: criminals });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

addCriminal = async (req, res) => {
  // const props = Object.keys(Criminal.schema.obj);
  try {
    // if (props.length === Object.keys(req.body).length) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ err: err.message, sucess: false });
      } else if (err) {
        console.log(err);
        return res.status(500).json({ err: err.message, sucess: false });
      }
      // Handling data after image upload
      console.log(req.file);
      // res.status(200).json({ sucess: true });
      if (req.file !== undefined) {
        req.body.imageUrl = `uploads/criminals/${req?.file?.filename}`;
        // const criminal = new Criminal();
        const criminal = await Criminal.create(req.body);
        const { nok_name, nok_no, nok_rel } = req.body;
        criminal.nok = {
          name: nok_name,
          mobile: nok_no,
          relationship: nok_rel,
        };
        criminal.save(() => console.log("nok info added successfully"));
        console.log(criminal);

        res.status(200).json({ sucess: true, data: criminal });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "You didnt uplaod the right file" });
      }
    });

    // } else {
    // const empty = props.filter((prop) => !req.body.hasOwnProperty(prop));
    // res.status(400).json({ success: false, msg: empty });
    // }
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

getCriminalByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const criminal = await Criminal.findById(id);
    if (criminal) res.status(200).json({ sucess: true, data: criminal });
    else
      res
        .status(400)
        .json({ sucess: false, msg: "no entry match criminal ID" });
  } catch (error) {
    res.status(500).json({ sucess: false, msg: error });
  }
};

updateCriminalID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const update_criminal = await Criminal.findByIdAndUpdate(id, req.body);
    if (!update_criminal) {
      const err = new Error();
      err.message = "No criminal updated";
      throw err;
    }
    res.status(200).json({ sucess: true, data: id });
  } catch ({ message }) {
    res.status(500).json({ success: false, message });
  }
};

deleteCrimalByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const delete_criminal = await Criminal.findByIdAndDelete(id);
    if (!delete_criminal) return;
    res.status(200).json({ sucess: true, id });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

getCriminalCrime = async (req, res) => {
  const { id } = req.params;
  const criminal = await Criminal.findById(id).populate("crime");
  res.json({ mode: "texting", data: criminal.crime });
};
module.exports = {
  getCriminals,
  addCriminal,
  getCriminalByID,
  updateCriminalID,
  deleteCrimalByID,
  getCriminalCrime,
};
