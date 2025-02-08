const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, PurchaseModel, CourseModel } = require("../db/db");
const { UserAuth } = require("../auth/UserAuth");
const { JWT_USER_PASSWORD } = require("../config");

const UserRouter = Router();

// Sign Up Page
UserRouter.post("/signup", async (req, res) => {
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

  const parseUserDataWithSuccess = requireBody.safeParse(req.body);

  if (!parseUserDataWithSuccess.success) {
    res.status(403).json({
      message: "Invalid email or password",
      error: parseUserDataWithSuccess.error,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  if (hashedPassword) {
    const createUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(200).json({
      message: "You are Signed Up 👏",
      createUser,
    });
  } else {
    res.status(403).json({
      message: "User Alredy Exists !!!",
    });
  }
});

// Sign In Page
UserRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  });

  if (!user) {
    res.status(403).json({
      message: "User Not Found",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (comparePassword) {
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});

// Main page
UserRouter.get("/", UserAuth, (req, res) => {
  res.status(200).json({
    message: "This is HOME page",
  });
});

//Purchase Course Course
UserRouter.get("/purchases", UserAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await PurchaseModel.find({
      userId: userId,
    });

    const courseData = await CourseModel.find({
      _id: { $in: purchases.map((x) => x.courseId) },
    });

    res.status(200).json({
      purchases,
      courseData,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something went wrong",
      error: e,
    });
  }
});

module.exports = {
  UserRouter,
};
