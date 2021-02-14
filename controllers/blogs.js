const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!request.body.title) {
    return response.status(400).json({
      error: "title missing",
    });
  }

  if (!request.body.url) {
    return response.status(400).json({
      error: "url missing",
    });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog(request.body);
  blog.user = user._id;

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const saved = await blog.save();

  user.blogs = user.blogs.concat(saved._id);
  await user.save();

  response.status(201).json(saved);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const entry = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  const updatedEntry = await Blog.findByIdAndUpdate(request.params.id, entry, {
    new: true,
    runValidators: true,
  });

  response.json(updatedEntry).end();
});

module.exports = blogsRouter;
