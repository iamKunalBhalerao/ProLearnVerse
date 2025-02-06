const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");

const CourseRouter = Router();

CourseRouter.get("/purchase", (req, res) => {});
CourseRouter.get("/preview", (req, res) => {});

module.exports = {
  CourseRouter,
};
