const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogs.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("three blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(3);
});

test("blogs have property id", async () => {
  const response = await api.get("/api/blogs");

  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});

test("can create a new blog post", async () => {
  const newBlog = {
    title: "you4",
    author: "bob",
    url: "http://allaboutbob.me",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((n) => n.title);
  expect(contents).toContain("you4");
});

test("can create a new blog post with no likes and that returns 0", async () => {
  const newBlog = {
    title: "you4",
    author: "bob",
    url: "http://allaboutbob.me",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const last = helper.initialBlogs.length;
  const likes = blogsAtEnd[last].likes;
  expect(likes).toEqual(0);
});

test("cannot create a new blog post with no title", async () => {
  const newBlog = {
    author: "bob",
    url: "http://allaboutbob.me",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("cannot create a new blog post with no url", async () => {
  const newBlog = {
    title: "you4",
    author: "bob",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
});

test("a blog can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const update = {
    title: "you4",
    author: "bob",
    url: "http://allaboutme.com",
    likes: 50,
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(update).expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

  expect(blogsAtEnd[0].likes).toEqual(update.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
