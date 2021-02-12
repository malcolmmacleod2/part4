const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url:
          "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
      },
    ];

    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("totalLikes returns 64", () => {
    const blogs = [
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.me",
        likes: 10,
      },
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.me",
        likes: 54,
      },
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.me",
        likes: 0,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(64);
  });
});

describe("Favourite blog", () => {
  test("One blog returns 1 like", () => {
    const blogs = [
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.me",
        likes: 10,
      },
    ];

    const result = listHelper.favouriteBlog(blogs);
    expect(result).toEqual(blogs[0]);
  });

  test("Zero blog returns empty", () => {
    const blogs = [];

    const result = listHelper.favouriteBlog(blogs);
    expect(result).toEqual([]);
  });

  test("favouriteBlog of 3 returns you2", () => {
    const blogs = [
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

    const result = listHelper.favouriteBlog(blogs);
    expect(result.name).toEqual(blogs[1].name);
  });
});

describe("Most likes", () => {
  test("Should return bob", () => {
    const blogs = [
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.you",
        likes: 10,
      },
      {
        title: "you2",
        author: "bob",
        url: "http://allaboutbob.you2",
        likes: 10,
      },
      {
        title: "me",
        author: "bill",
        url: "http://allaboutbob.me",
        likes: 10,
      },
      {
        title: "them",
        author: "jim",
        url: "http://allaboutbob.them",
        likes: 10,
      },
    ];

    const result = listHelper.mostLikes(blogs);
    expect(result.author).toEqual("bob");
    expect(result.likes).toEqual(20);
  });
});

describe("Most blogs", () => {
  test("Should return bob", () => {
    const blogs = [
      {
        title: "you",
        author: "bob",
        url: "http://allaboutbob.you",
        likes: 10,
      },
      {
        title: "you2",
        author: "bob",
        url: "http://allaboutbob.you2",
        likes: 10,
      },
      {
        title: "me",
        author: "bill",
        url: "http://allaboutbob.me",
        likes: 10,
      },
      {
        title: "them",
        author: "jim",
        url: "http://allaboutbob.them",
        likes: 10,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result.author).toEqual("bob");
    expect(result.blogs).toEqual(2);
  });
});
