const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const initialBlogs = [
  {
    title: "you1",
    author: "bob",
    url: "http://allaboutbob.me",
    likes: 10,
  },
  {
    title: "you2",
    author: "bob",
    url: "http://allaboutbob.me",
    likes: 54,
  },
  {
    title: "you3",
    author: "bob",
    url: "http://allaboutbob.me",
    likes: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[2]);
  await blogObject.save();
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

afterAll(() => {
  mongoose.connection.close();
});
