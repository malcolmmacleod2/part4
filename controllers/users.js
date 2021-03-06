const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.password) {
    return response.status(400).json({
      error: "password missing",
    });
  }

  if (body.password.length < 3) {
    return response.status(400).json({
      error: "password too short",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();

    response.status(200).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

module.exports = usersRouter;
