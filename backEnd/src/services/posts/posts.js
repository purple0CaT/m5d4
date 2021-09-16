import express from "express";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import {
  getIdMiddleware,
  postMiddleware,
  putMiddleware,
  getTitleMiddleware,
} from "./checkMiddleware.js";
import { writePost, getPost, coverPath, saveCoverrPic } from "../fs-tools.js";

const postStirve = express.Router();

//== GET
postStirve.get("/", getTitleMiddleware, async (req, res, next) => {
  if (req.query.title && req.query) {
    try {
      const posts = await getPost();
      const searchT = posts.filter((post) =>
        post.title.toLowerCase().includes(req.query.title.toLowerCase())
      );
      res.send(searchT);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  } else {
    try {
      const posts = await getPost();
      res.send(posts);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  }
});
//== GETby ID
postStirve.get("/:postId", getIdMiddleware, async (req, res, next) => {
  try {
    const posts = await getPost();
    const postFilter = posts.filter((post) => post._id == req.params.postId);
    res.status(200).send(postFilter);
  } catch (error) {
    next(createHttpError(400, "Bad request"));
  }
});

// POST IMG
postStirve.post(
  "/:postId/uploadCover",
  getIdMiddleware,
  multer().single("coverPic"),
  async (req, res, next) => {
    try {
      let typeFile = req.file.originalname.split(".").reverse()[0];
      let nameOfFile = req.params.postId + "." + typeFile;
      await saveCoverrPic(nameOfFile, req.file.buffer);
      // fitering and edditing the Authors url
      const posts = await getPost();
      const index = posts.findIndex((post) => post._id == req.params.postId);
      const updatePosts = {
        ...posts[index],
        cover: coverPath + nameOfFile,
      };
      posts[index] = updatePosts;
      //   save file
      await writePost(posts);
      res.send("Ok");
    } catch (err) {
      next(err);
    }
  }
);

// POST
postStirve.post("/", postMiddleware, async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    try {
      const newPost = {
        ...req.body,
        comments: [],
        _id: uniqid(),
        createdAt: new Date(),
      };
      const posts = await getPost();
      posts.push(newPost);
      //   save send
      await writePost(posts);
      res.status(200).send(newPost);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  }
});
// PUT
postStirve.put(
  "/:postId",
  putMiddleware,
  postMiddleware,
  async (req, res, next) => {
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      try {
        const posts = await getPost();
        const index = posts.findIndex((post) => post._id == req.params.postId);
        const updatePost = { ...posts[index], ...req.body };
        posts[index] = updatePost;
        //   save send
        await writePost(posts);
        res.status(200).send(updatePost);
      } catch (err) {
        next(createHttpError(406, "Not Acceptable"));
      }
    }
  }
);
// DELETE CHECKER
postStirve.delete("/:postId", getIdMiddleware, async (req, res, next) => {
  try {
    const posts = await getPost();
    const postFiltered = posts.filter((post) => post._id != req.params.postId);
    await writePost(postFiltered);
    res.status(200).send("Successfuly deleted");
  } catch (err) {
    next(createHttpError(406, "Not Acceptable"));
  }
});
// Comments
// Get
postStirve.get("/:postId/comments", getIdMiddleware, async (req, res, next) => {
  try {
    const posts = await getPost();
    const post = posts.filter((post) => post._id == req.params.postId);
    res.status(200).send(post[0].comments);
  } catch (error) {
    next(createHttpError(400, "Bad request"));
  }
});
// Post
postStirve.post(
  "/:postId/comments",
  getIdMiddleware,
  async (req, res, next) => {
    try {
      const newComment = { ...req.body, _id: uniqid() };
      // const post = posts.filter((post) => post._id == req.params.postId);
      // post[0].comments.push(newComment);
      const posts = await getPost();
      const index = posts.findIndex((post) => post._id == req.params.postId);
      // const updatePost = { ...posts[index], ...req.body };
      let updatePosts = posts[index];
      updatePosts = {
        ...posts[index],
        comments: [...updatePosts.comments, newComment],
      };
      posts[index] = updatePosts;
      await writePost(posts);
      res.status(200).send(newComment);
    } catch (error) {
      next(createHttpError(400, "Bad request"));
    }
  }
);

// exp
export default postStirve;
