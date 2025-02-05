const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

function main() {
  mongoose.connect(process.env.MONGO_URL);
  app.listen(5000, () => {
    console.log("server is on PORT:5000");
  });
}

main();
