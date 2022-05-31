const express = require("express");
const { v4: uuidV4 } = require("uuid");
global.db = require("./db");

const app = express();

const port = 3333;
const uri = "http://localhost";
const dateConsole = new Date();
const hour = new Date().getHours();
const minutes = new Date().getMinutes();

app.use(express.json());

function logroutes(req, res, next) {
  const { method, url } = req;

  const route = `[${method.toUpperCase()}] ${url}`;

  console.log(route);

  return next();
}

app.use(logroutes);

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Rota Principal OK!" });
});

app.get("/projects", async (req, res) => {
  const projects = await global.db.findAll();

  return res.json(projects);
});

app.get("/projects/categories", async (req, res) => {
  const { category } = req.query;

  const categoryExists = await global.db.findByCategory(category);

  if (!category) {
    return res
      .status(404)
      .send({ error: "does not exists projects with this category" });
  }
  return res.json(categoryExists);
});

app.get("/projects/:id", async (req, res) => {
  const { id } = req.params;

  const projectExists = await global.db.findById(id);

  if (!projectExists) {
    return res.json({ error: "Project not found" });
  }

  return res.json(projectExists);
});

app.post("/projects", async (req, res) => {
  const { name, category } = req.body;

  const projectExists = await global.db.findByName(name);

  if (projectExists) {
    return res.json({ message: "Project already exists" });
  }

  const project = {
    project_id: uuidV4(),
    name,
    category,
    created_at: new Date(),
  };

  await global.db.insert(project);

  return res.status(201).json(project);
});

app.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const projectExists = await global.db.findById(id);

  if (!projectExists) {
    return res.json({ message: "Project not exists!" });
  }

  await global.db.update(
    (projectExists.name = name),
    (projectExists.category = category)
  );

  return res.status(200).json(projectExists);
});

app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;

  const projectExists = await global.db.findById(id);

  if (!projectExists) {
    return res.json({ message: "Project not exists!" });
  }

  const d = await global.db.deleteById(id);
  console.log(d);
  return res.status(204).send();
});

app.listen(port, () => {
  console.log({
    message: `Uou...O Servidor está ON na porta ${port}🤘`,
    access: `Acesse no seu navegador ${uri}:${port}`,
    date: dateConsole.toLocaleDateString(),
    Time: `${hour}:${minutes}`,
  });
});
