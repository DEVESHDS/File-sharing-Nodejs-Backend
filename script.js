const File = require("./models/file");
const fs = require("fs");
const connectDB = require("./config/db");
connectDB();

async function deleteData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt: { $lt: pastDate } });
  for (const file of files) {
    try {
      fs.unlinkSync(file.path);
      await File.findOneAndRemove({ uuid: file.uuid });
    } catch (err) {
      console.log("error while deleting files");
    }
  }
}

deleteData().then(() => {
  console.log("Deletion of files is successfull");
  process.exit();
});
