const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
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

  const blog = new Blog(request.body);

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const saved = await blog.save();
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
