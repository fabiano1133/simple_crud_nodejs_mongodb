const mongoClient = require("mongodb").MongoClient;

mongoClient
  .connect("mongodb://localhost:27017")
  .then((conn) => (global.conn = conn.db("projects_db")))
  .catch((err) => console.error(err));

function findAll() {
  return global.conn.collection("projects").find().toArray();
}

function findByName(name) {
  return global.conn.collection("projects").findOne({ name: name });
}

function findByCategory(category) {
  return global.conn.collection("projects").find({ category }).toArray();
}

function findById(projectId) {
  return global.conn.collection("projects").findOne({ project_id: projectId });
}

function insert(project) {
  return global.conn.collection("projects").insertOne(project);
}

function update(name, category) {
  return global.conn
    .collection("projects")
    .updateMany(
      { name: { $exists: name, $exists: category } },
      { $set: { name: name, category: category } }
    );
}

function deleteById(projectId) {
  myQuery = { project_id: projectId };
  return global.conn.collection("projects").deleteOne(myQuery);
}

module.exports = {
  findAll,
  insert,
  findByName,
  findByCategory,
  findById,
  update,
  deleteById,
};
