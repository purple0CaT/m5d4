import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import {
  getIdMiddleware,
  postMiddleware,
  putMiddleware,
  getTitleMiddleware,
} from "./checkMiddleware.js";
import uniqid from "uniqid";
import { send } from "process";

const postStirve = express.Router();

// Path func
const postJson = join(dirname(fileURLToPath(import.meta.url)), "postsLib.json");

// get write
const getPost = () => JSON.parse(fs.readFileSync(postJson));
const writePost = (content) =>
  fs.writeFileSync(postJson, JSON.stringify(content));
console.log(postJson);
//=

//== GET
postStirve.get("/", getTitleMiddleware, (req, res, next) => {
  if (req.query.title && req.query) {
    try {
      const posts = getPost();
      const searchT = posts.filter((post) =>
        post.title.toLowerCase().includes(req.query.title.toLowerCase())
      );
      res.send(searchT);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  } else {
    try {
      const posts = getPost();
      res.send(posts);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  }
});
//== GETby ID
postStirve.get("/:postId", getIdMiddleware, (req, res, next) => {
  try {
    const posts = getPost();
    const postFilter = posts.filter((post) => post._id == req.params.postId);
    res.status(200).send(postFilter);
  } catch (error) {
    next(createHttpError(400, "Bad request"));
  }
});
// POST
postStirve.post("/", postMiddleware, (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    try {
      const newPost = { ...req.body, _id: uniqid(), createdAt: new Date() };
      const posts = getPost();
      posts.push(newPost);
      //   save send
      writePost(posts);
      res.status(200).send(newPost);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  }
});
// PUT
postStirve.put("/:postId", putMiddleware, postMiddleware, (req, res, next) => {
  console.log("start");
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    try {
      const posts = getPost();
      const index = posts.findIndex((post) => post._id == req.params.postId);
      const updatePost = { ...posts[index], ...req.body };
      posts[index] = updatePost;
      console.log(posts);
      //   save send
      writePost(posts);
      res.status(200).send(updatePost);
    } catch (err) {
      next(createHttpError(406, "Not Acceptable"));
    }
  }
});
// DELETE CHECKER
postStirve.delete("/:postId", getIdMiddleware, (req, res, next) => {
  try {
    const posts = getPost();
    const postFiltered = posts.filter((post) => post._id != req.params.postId);
    writePost(postFiltered);
    res.status(200).send("Successfuly deleted");
  } catch (err) {
    next(createHttpError(406, "Not Acceptable"));
  }
});
// exp
export default postStirve;
