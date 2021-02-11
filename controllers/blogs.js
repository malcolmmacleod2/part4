const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const saved = await blog.save();
  response.status(201).json(saved);
});

module.exports = blogsRouter;
