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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
