const chai = require("chai");
const supertest = require("supertest");
const app = require("../app");

const expect = chai.expect;
const request = supertest(app);

describe("POST /api/todos/", () => {
  it("должен создавать новую задачу (todo) и возвращать ее", async () => {
    const newTask = {
      title: "Новая задача",
    };

    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI0Nzg1NzUsImV4cCI6MTcwMjQ4MjE3NX0.VfIA0JDb7s7MfGlyt9PUdWWR04NJH1Xrg3qKCiMKfeE";

    const response = await request
      .post("/api/todos/")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newTask);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("id");
    expect(response.body.title).to.equal(newTask.title);
  });

  it("должен возвращать ошибку при отсутствии title ", async () => {
    const todoData = {
      info: "Новая задача",
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI0Nzg1NzUsImV4cCI6MTcwMjQ4MjE3NX0.VfIA0JDb7s7MfGlyt9PUdWWR04NJH1Xrg3qKCiMKfeE";
    const response = await request
      .post("/api/todos/")
      .set("Authorization", `Bearer ${token}`)
      .send(todoData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("errors");
  });
});

describe("GET /api/todos/", () => {
  it("должен возвращать корректный список задач", async () => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI0Nzg1NzUsImV4cCI6MTcwMjQ4MjE3NX0.VfIA0JDb7s7MfGlyt9PUdWWR04NJH1Xrg3qKCiMKfeE";

    const response = await request
      .get("/api/todos/")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("должен возвращать пустой массив, если задачи отсутствуют.", async () => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI0Nzg1NzUsImV4cCI6MTcwMjQ4MjE3NX0.VfIA0JDb7s7MfGlyt9PUdWWR04NJH1Xrg3qKCiMKfeE";

    const response = await request
      .get("/api/todos/")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body).to.have.lengthOf(0);
  });
});

describe("PATCH /api/todos/{id}", () => {
  it("должен успешно обновлять задачи с корректными данными", async () => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I";

    const taskId = "c7c06ad5-0afd-4c4a-b125-611af4882608";
    const updatedData = {
      title: "Новый заголовок",
    };

    const response = await request
      .patch(`/api/todos/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("title", updatedData.title);
  });
  it("должен возвращать ошибку при обновлении несуществующей задачи", async () => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I";

    const taskId = "c7c06ad5-0afd-4c4a-b125-611af4882608";
    const updatedData = {
      info: "Новая информация",
    };

    const response = await request
      .patch(`/api/todos/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("errors");
  });
});

describe("PATCH /api/todos/{id}/isCompleted", () => {
  it("должен успешно изменять значение isCompleted на true", async () => {
    const taskId = "c7c06ad5-0afd-4c4a-b125-611af4882608";
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I"; // Замените на ваш токен авторизации
    const response = await request
      .patch(`/api/todos/${taskId}/isCompleted`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ isCompleted: true });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("isCompleted", true);
  });

  it("должен успешно изменять значение isCompleted на false", async () => {
    const taskId = "c7c06ad5-0afd-4c4a-b125-611af4882608";
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I";
    const response = await request
      .patch(`/api/todos/${taskId}/isCompleted`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ isCompleted: false });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("isCompleted", false);
  });
});

describe("DELETE /api/todos/{id}", () => {
  it("должен успешно удалять todo по id", async () => {
    const taskId = "c7c06ad5-0afd-4c4a-b125-611af4882608";
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I";
    const response = await request
      .delete(`/api/todos/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
  });
  it("должен возвращать ошибку при удалении несуществующей задачи", async () => {
    const taskId = "c7c06ad5";
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmFlZmU1NS02ODk4LTQ4MjUtOWRkMS1mYmRjNzhkYTZiZjQiLCJpYXQiOjE3MDI1NTIwNTIsImV4cCI6MTcwMjU1NTY1Mn0.HthYOZDvfEdi0UaNOYDliJVspahDXRmMk6Egf-uYU8I";
    const response = await request
      .delete(`/api/todos/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("errors");
  }).timeout(10000);
});
