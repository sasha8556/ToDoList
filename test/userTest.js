const chai = require("chai");
const supertest = require("supertest");
const app = require("../app");

const expect = chai.expect;
const request = supertest(app);

describe("POST /api/users/register", () => {
  it("должен регистрировать нового пользователя и возвращать сообщение", async () => {
    const userData = {
      login: "testuser",
      password: "testpassword",
    };

    const response = await request.post("/api/users/register").send(userData);

    expect(response.status).to.equal(201);
  });

  it("должен возвращать ошибку при неполных данных", async () => {
    const userData = {
      username: "testuser",
    };

    const response = await request.post("/api/users/register").send(userData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("errors");
  });

  it("должен возвращать ошибку при регистрации с существующим именем пользователя", async () => {
    const existingUser = {
      login: "existingUser",
      password: "existingPassword",
    };

    await request.post("/api/users/register").send(existingUser);
    const response = await request
      .post("/api/users/register")
      .send(existingUser);

    expect(response.status).to.equal(201);
    expect(response.body.error).to.equal(
      "Пользователь с таким login уже существует"
    );
  });
});

describe("POST /api/users/login", () => {
  it("должен входить пользователя и возвращать сообщение", async () => {
    const userData = {
      login: "testuser",
      password: "testpassword",
    };

    await request.post("/api/users/register").send(userData);

    const response = await request.post("/api/users/login").send(userData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
  });

  it("должен возвращать ошибку при неверных учетных данных", async () => {
    const userData = {
      login: "anotheruser",
      password: "anotherpassword",
    };

    const response = await request.post("/api/users/login").send(userData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });
});
