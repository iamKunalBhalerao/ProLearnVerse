const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const PurchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const CourseContentSchema = new Schema({
  videoUrl: String,
  imageUrl: String,
  price: String,
});

const UserModel = model("users", UserSchema);
const AdminModel = model("admins", AdminSchema);
const CourseModel = model("courses", CourseSchema);
const PurchaseModel = model("purchases", PurchaseSchema);
const CourseContentModel = model("coursecontent", CourseContentSchema);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
  CourseContentModel,
};
