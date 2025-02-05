const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { UserRouter } = require("./pages/user");
const { AdminRouter } = require("./pages/admin");
const { CourseRouter } = require("./pages/course");
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/course", CourseRouter);

function main() {
  mongoose.connect(process.env.MONGO_URL);
  app.listen(process.env.SERVER_PORT || 8000, () => {
    console.log("server is on PORT:5000");
  });
}

main();
