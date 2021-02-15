const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
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

  const user = await User.findById(request.token.id);

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
  const blog = await Blog.findById(request.params.id).populate("User");

  if (!blog) {
    return response.status(404).json({
      error: "blog not found",
    });
  }

  const user = await User.findById(request.token.id);

  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: "Unauthorized",
    });
  }

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
