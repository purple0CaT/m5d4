import createHttpError from "http-errors";
import { getAuthor } from "../fs-tools.js";
import { body } from "express-validator";

export const checkAuthorId = async (req, res, next) => {
  const authors = await getAuthor();
  const check = authors.some((auth) => auth._id == req.params.authorId);
  if (check) {
    next();
  } else {
    next(createHttpError(404, "Author not found"));
  }
};
export const checkPostValid = [
  body("name").exists().notEmpty().withMessage("Name is a mandatory field!"),
  body("surname")
    .exists()
    .notEmpty()
    .withMessage("Surname is a mandatory field!"),
  body("email")
    .exists()
    .notEmpty()
    .isEmail()
    .withMessage("Email is a mandatory field!"),
  body("dateBirth")
    .exists()
    .notEmpty()
    .withMessage("Date of Birth is a mandatory field!"),
  body("avatar").exists().withMessage("Avatar is a mandatory field!"),
];

