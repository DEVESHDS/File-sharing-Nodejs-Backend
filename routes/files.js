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

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
  }
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email is already sent" });
    }
    // file.sender = emailFrom;
    // file.receiver = emailTo;
    const response = await File.findOneAndUpdate(
      { uuid: uuid },
      { sender: emailFrom, receiver: emailTo }
    );
  } catch (err) {
    res.send({ error: "Some error occured at database" });
  }
  const file = File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email is already sent" });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await File.findOneAndUpdate(
    { uuid: uuid },
    { sender: emailFrom, receiver: emailTo }
  );
  // const response = await File.file.save();
  //send email
  const sendmail = require("../services/emailService");
  sendmail({
    from: emailFrom,
    to: emailTo,
    subject: "File Sharing",
    text: `${emailFrom} has shared a file with you`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  res.send({ success: "MAil sent successfully" });
});

module.exports = router;
