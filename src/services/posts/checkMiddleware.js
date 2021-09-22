import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import createHttpError from "http-errors";
import { body } from "express-validator";

const postJson = join(dirname(fileURLToPath(import.meta.url)), "postsLib.json");
const getPost = () => JSON.parse(fs.readFileSync(postJson));

// get ID check
export const getIdMiddleware = (req, res, next) => {
  const posts = getPost();
  const check = posts.some((post) => post._id == req.params.postId);
  if (check) {
    next();
  } else {
    next(createHttpError(400, "Bad request, no such post!"));
  }
};
// POST
export const postMiddleware = [
  body("category")
    .exists()
    .notEmpty()
    .withMessage("category is a mandatory field!"),
  body("title").exists().notEmpty().withMessage("title is a mandatory field!"),
  body("cover").exists().notEmpty().withMessage("cover is a mandatory field!"),
  body("readTime.value")
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage("category is a mandatory field!"),
  body("readTime.unit")
    .exists()
    .notEmpty()
    .withMessage("category is a mandatory field!"),
  body("author.name")
    .exists()
    .notEmpty()
    .withMessage("name is a mandatory field!"),
  body("author.avatar")
    .exists()
    .notEmpty()
    .withMessage("avatar is a mandatory field!"),
  body("content")
    .exists()
    .notEmpty()
    .withMessage("content is a mandatory field!"),
];
// PUT CHECKER
export const putMiddleware = (req, res, next) => {
  const posts = getPost();
  const check = posts.some((post) => post._id == req.params.postId);
  if (check) {
    next();
  } else {
    next(createHttpError(400, "Bad request, no such post!"));
  }
};

// GET TITLE
export const getTitleMiddleware = (req, res, next) => {
  const posts = getPost();
  if (req.query && req.query.title) {
    const check = posts.some((post) =>
      post.title.toLowerCase().includes(req.query.title.toLowerCase())
    );
    if (check) {
      next();
    } else {
      next(createHttpError(400, "Bad request, no such title!"));
    }
  } else {
    next();
  }
};
