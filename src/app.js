const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkRepoExist(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((el) => el.id === id);

  if (!repository) {
    response.status(400).json({ error: "Id is required" });
  }

  next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepoExist, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find((el) => el.id === id);

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepoExist, (request, response) => {
  const { id } = request.params;

  const repository = repositories.findIndex((el) => el.id === id);

  repositories.splice(repository, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", checkRepoExist, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((el) => el.id === id);

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
