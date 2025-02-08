const { Router } = require("express");
const { UserAuth } = require("../auth/UserAuth");
const { CourseModel, PurchaseModel } = require("../db/db");

const CourseRouter = Router();

CourseRouter.post("/purchase", UserAuth, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  try {
    const purchaseCourse = await PurchaseModel.create({
      userId,
      courseId,
    });

    res.status(200).json({
      message: "You Have SUccessfully Bought the Course ",
      courseData: purchaseCourse,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
});
CourseRouter.get("/preview", async (req, res) => {
  const allCourses = await CourseModel.find({});
  if (allCourses) {
    res.status(200).json({
      message: "All Courses",
      courses: allCourses,
    });
  } else {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
});

module.exports = {
  CourseRouter,
};
