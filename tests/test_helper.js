const Blog = require("../models/blog");
const User = require("../models/user");

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
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
