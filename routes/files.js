const router = require("express").Router();
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All field are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //store file into database

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const reponse = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});
