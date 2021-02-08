const { groupBy } = require("lodash");
const _ = require("lodash");

const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.map((b) => b.likes).reduce((s, v) => s + v);
};

const favouriteBlog = (blogs) => {
  sorted = blogs.sort((a, b) => b.likes - a.likes);
  return sorted.length > 0 ? blogs[0] : [];
};

const mostBlogs = (blogs) => {
  grouped = _.groupBy(blogs, (b) => b.author);

  most = 0;
  mostAuthor = "";

  _.forEach(grouped, function (g, author) {
    console.log(author);
    const total = g.length;

    if (total > most) {
      most = total;
      mostAuthor = author;
    }
  });

  return { author: mostAuthor, blogs: most };
};

const mostLikes = (blogs) => {
  grouped = _.groupBy(blogs, (b) => b.author);

  most = 0;
  mostAuthor = "";

  _.forEach(grouped, function (g, author) {
    console.log(author);
    const total = g.map((i) => i.likes).reduce((s, t) => s + t);

    if (total > most) {
      most = total;
      mostAuthor = author;
    }
  });

  return { author: mostAuthor, likes: most };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
