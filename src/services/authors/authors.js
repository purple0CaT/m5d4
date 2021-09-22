import express from "express";
import uniqid from "uniqid";
import multer from "multer";
import createHttpError from "http-errors";
import { join } from "path";

import { getAuthor, writeAuthor, getPost } from "../fs-tools.js";
import { checkAuthorId, checkPostValid } from "./validMidW.js";
import { validationResult } from "express-validator";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, //authomatic read cloud URL
  params: {
    folder: "StriveBlog-Avatars",
  },
});
// ==
const authorStrive = express.Router();

// =========== METHODS ================
// GET
authorStrive.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthor();
    res.status(201).send(authors);
  } catch (err) {
    res.send(err);
  }
  //   return file
});
//GET BY ID
authorStrive.get("/:authorId", checkAuthorId, async (req, res, next) => {
  const authors = await getAuthor();
  try {
    const author = authors.find((author) => author._id === req.params.authorId);
    res.status(201).send(author);
  } catch (err) {
    next();
  }
});
// POST IMG
authorStrive.post(
  "/:authorId/uploadAvatar",
  // checkAuthorId,
  multer({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
        cb(createHttpError(400, "Format not suported!"), false);
      else cb(null, true);
    },
  }).single("avatar"),
  async (req, res, next) => {
    try {
      const urlPhoto = req.file.path;
      const authors = await getAuthor();
      const index = authors.findIndex(
        (authr) => authr._id == req.params.authorId
      );
      const updateAuthor = {
        ...authors[index],
        avatar: urlPhoto,
      };
      authors[index] = updateAuthor;
      //   save file
      await writeAuthor(authors);
      // CHANGE IN POSTs AUTHOR
      // const posts = await getPost();
      // let indexes = [];
      // console.log(indexes);
      // for (i = 0; i < posts.length; i++) {
      //   if (posts[i].author._id == req.params.authorId) {
      //     indexes.push(1);
      //   }
      // }
      // console.log(indexes);
      // console.log(posts[5]);
      // =
      res.send("Ok");
    } catch (err) {
      next(err);
    }
  }
);
// POST
authorStrive.post("/", async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    // true
    const authors = await getAuthor();
    try {
      const newAuthor = { ...req.body, _id: uniqid() };
      authors.push(newAuthor);
      // rewrite
      await writeAuthor(authors);
      res.status(201).send(newAuthor);
    } catch (err) {
      next(err);
    }
  }
});

// PUT
authorStrive.put(
  "/:postId",
  checkAuthorId,
  checkPostValid,
  async (req, res, next) => {
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      // SUCCESS POST
      const posts = await getPost();
      const index = posts.findIndex((post) => post._id == req.params.postId);
      const updateAuthor = { ...authors[index], ...req.body };
      authors[index] = updateAuthor;
      //   save file
      await writeAuthor(authors);
      res.status(201).send(updateAuthor);
    }
  }
);
// delete
authorStrive.delete("/:postId", checkAuthorId, async (req, res, next) => {
  const authors = await getAuthor();
  try {
    const filtered = authors.filter((auth) => auth._id != req.params.postId);
    //   rewrite
    await writeAuthor(filtered); // response
    res.status(201).send("deleted");
  } catch (err) {
    next(err);
  }
});
// ==
export default authorStrive;
