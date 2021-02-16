require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.mongourl, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("connection failed");
    });
}

module.exports = connectDB;
