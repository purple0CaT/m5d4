import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
// ==
const authorStrive = express.Router();
// Path to libr
const curentJson = fileURLToPath(import.meta.url);
const currentDirP = dirname(curentJson);
const authorJson = join(currentDirP, "authorsLib.json");

console.log("authorJson -", authorJson);

// =========== METHODS ================
// GET
authorStrive.get("/", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJson));
  //   return file
  res.status(201).send(authors);
});
//GET BY ID
authorStrive.get("/:postId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJson));
  const author = authors.find((author) => author._id === req.params.postId);
  if (!author) {
    console.log(author);
    res.status(401).send("Author not exist");
  } else {
    console.log(author);
    //   return file
    res.status(201).send(author);
  }
});
// POST
authorStrive.post("/", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJson));
  const authorCheck = authors.find((author) => author.email === req.body.email);
  const newAuthor = { ...req.body, _id: uniqid() };
  if (
    req.body.name &&
    req.body.surname &&
    req.body.email &&
    req.body.avatar &&
    req.body.dateBirth
  ) {
    if (authorCheck) {
      res.status(418).send("Email already exists");
    } else {
      // SUCCESS POST
      authors.push(newAuthor);
      // rewrite
      fs.writeFileSync(authorJson, JSON.stringify(authors));
      //   response
      res.status(201).send(newAuthor);
    }
  } else {
    res.status(400).send("Bad request");
  }
});
// PUT
authorStrive.put("/:postId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJson));
  const index = authors.findIndex((author) => author._id === req.params.postId);
  if (index >= 0) {
    if (
      req.body.name &&
      req.body.surname &&
      req.body.email &&
      req.body.avatar &&
      req.body.dateBirth
    ) {
      // SUCCESS POST
      const updateAuthor = { ...authors[index], ...req.body };
      authors[index] = updateAuthor;
      //   save file
      fs.writeFileSync(authorJson, JSON.stringify(authors));
      //   response
      res.status(201).send(updateAuthor);
    } else {
      res.status(401).send("Bad request");
    }
  } else {
    res.status(400).send("Bad request");
  }
});
// delete
authorStrive.delete("/:postId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJson));

  const filtered = authors.filter((auth) => auth._id != req.params.postId);
  //   rewrite
  fs.writeFileSync(authorJson, JSON.stringify(filtered));
  // response
  res.status(201).send("deleted");
});
// ==
export default authorStrive;
