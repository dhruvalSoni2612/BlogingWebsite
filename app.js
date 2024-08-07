require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const Blog = require("./models/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const app = express();
port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect(process.env.MONGO_URL).then((e) => {
  console.log("Connected to database");
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
