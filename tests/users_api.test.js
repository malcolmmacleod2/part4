const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

const User = require("../models/user");

let token = "";

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", name: "first", passwordHash });

    await user.save();

    const login = {
      username: "root",
      password: "sekret",
    };

    const response = await api.post("/api/login").send(login);
    token = response.body.token;
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("get returns 2 users", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/users")
      .set({ Authorization: `bearer ${token}` });

    expect(response.body).toHaveLength(2);
  });
});

describe("a user should not be created", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", name: "first", passwordHash });

    await user.save();

    const login = {
      username: "root",
      password: "sekret",
    };

    const response = await api.post("/api/login").send(login);
    token = response.body.token;
  });

  test("when username is not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: null,
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Path `username` is required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("when password is not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Jim",
      name: "dfs",
      password: null,
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("password missing");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("when username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ab",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "shorter than the minimum allowed length"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("when password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "abce",
      name: "Ma",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("password too short");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("when username is not unique", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Mawerqw werqr",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Error, expected `username` to be unique."
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
