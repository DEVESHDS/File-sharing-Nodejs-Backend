const express = require("express");
const app = express();

const PORT = process.env.port || 3000;

const connectDB = require("./config/db");
connectDB();

app.use("/api/upload", require("./routes/files"));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
