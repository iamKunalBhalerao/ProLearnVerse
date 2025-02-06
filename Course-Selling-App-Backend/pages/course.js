const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const { UserAuth } = require("../auth/UserAuth");

const CourseRouter = Router();

CourseRouter.get("/purchase", UserAuth, (req, res) => {});
CourseRouter.get("/preview", (req, res) => {});

module.exports = {
  CourseRouter,
};
