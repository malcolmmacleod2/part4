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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
