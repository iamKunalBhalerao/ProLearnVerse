const { Router } = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AdminAuth } = require("../auth/AdminAuth");
const { AdminModel, CourseModel } = require("../db/db");
const { JWT_ADMIN_PASSWORD } = require("../config");

const AdminRouter = Router();

// Admin Sign Up
AdminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: z
      .string()
      .min(3)
      .max(100)
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "Password must contain at least one special character",
      }),
  });

  const parseAdminBodyWithSuccess = requireBody.safeParse(req.body);

  if (!parseAdminBodyWithSuccess.success) {
    res.status(403).json({
      message: "Invalid Email or Password",
      error: parseAdminBodyWithSuccess.error,
    });
  }

  const hashedAdminPassword = await bcrypt.hash(password, 5);

  if (hashedAdminPassword) {
    const admin = await AdminModel.create({
      email: email,
      password: hashedAdminPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(200).json({
      message: "You are signed Up",
      admin: admin,
    });
  }
});

// Admin Sign In
AdminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({
    email: email,
  });

  if (!admin) {
    res.status(403).json({
      message: "User Not Found",
    });
  }

  const compareAdminPassword = bcrypt.compare(password, admin.password);

  if (compareAdminPassword) {
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
      error: compareAdminPassword.error,
    });
  }
});

// Admin Home Page
AdminRouter.get("/", AdminAuth, (req, res) => {
  res.status(200).json({
    message: "This is HOME page",
  });
});

// Admin Create Course
AdminRouter.post("/create-course", AdminAuth, async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl, creatorId } = req.body;

  try {
    const course = await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: adminId,
    });

    res.status(200).json({
      message: "Course Created Successfully",
      courseId: course._id,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something Went Wrong !!!",
      error: e.error,
    });
  }
});

// Admin Update Course
AdminRouter.put("/update-course", AdminAuth, async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await CourseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      {
        title,
        description,
        price,
        imageUrl,
      }
    );
    res.status(200).json({
      message: "Course Updated",
      courseId: course._id,
      courseData: course,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something went wrong",
      error: e.error,
    });
  }
});

// Admin Delete Course
AdminRouter.delete("/delete-course", AdminAuth, async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.body;

  try {
    const course = await CourseModel.deleteOne({
      _id: courseId,
      creatorId: adminId,
    });
    res.status(200).json({
      message: "Course Deleted",
      courseId: course._id,
      courseData: course,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something went wrong",
      error: e.error,
    });
  }
});

module.exports = {
  AdminRouter,
};
