import express from "express";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import multer from "multer";
import { validationResult } from "express-validator";
// MIDDLEWARES
import {
  getIdMiddleware,
  postMiddleware,
  putMiddleware,
  getTitleMiddleware,
} from "./checkMiddleware.js";
// WRITING POSTS
import { writePost, getPost, getAuthor, writeAuthor } from "../fs-tools.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, //authomatic read cloud URL
  params: {
    folder: "StriveBlog-img",
  },
});

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

// ========== POST Cover PHOTO

postStirve.post(
  "/:postId/uploadCover",
  getIdMiddleware,
  multer({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
        cb(createHttpError(400, "Format not suported!"), false);
      else cb(null, true);
    },
  }).single("coverPic"),
  async (req, res, next) => {
    try {
      let urlPhoto = req.file.path;
      // products
      const posts = await getPost();
      const index = posts.findIndex((p) => p._id == req.params.postId);
      let updatedPosts = {
        ...posts[index],
        cover: urlPhoto,
      };
      posts[index] = updatedPosts;
      await writePost(posts);

      res.status(200).send("Success!");
    } catch (error) {
      next(error);
    }
  }
);

// ======== REGULAR POST
// postMiddleware,
postStirve.post("/", async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    const newId = uniqid();
    const newAuthorId = uniqid();
    try {
      // AUTHOR SAVE
      if (!req.body.author._id) {
        const authors = await getAuthor();
        const newAuthor = { ...req.body.author, _id: newAuthorId };
        authors.push(newAuthor);
        await writeAuthor;
      }
      // POST CREATE
      const newPost = {
        ...req.body,
        comments: [],
        _id: newId,
        createdAt: new Date(),
      };
      const posts = await getPost();
      posts.push(newPost);
      //   save send
      await writePost(posts);
      let authorCheck = req.body.author._id != "" ? true : false;
      res
        .status(200)
        .send([{ _id: newId, author: authorCheck, authorId: newAuthorId }]);
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
// DELETE
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
// === GET COMMENTS
postStirve.get("/:postId/comments", getIdMiddleware, async (req, res, next) => {
  try {
    const posts = await getPost();
    const post = posts.filter((post) => post._id == req.params.postId);
    res.status(200).send(post[0].comments);
  } catch (error) {
    next(createHttpError(400, "Bad request"));
  }
});
// POST COMMENTS
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
// SAVE FILE
// postStirve.get("/streamSrc/save", async (req, res, next) => {
//   try {
//     res.setHeader("Content-Disposition", "atachment; filename=postsJson.json");
//     const source = getReadableStream();
//     const destination = res;
//     pipeline(source, destination, (err) => {
//       if (err) next(err);
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// POST IMAGE FORM
// postStirve.post(
//   "/",
//   // postMiddleware,
//   multer({
//     storage: cloudinaryStorage,
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
//         cb(createHttpError(400, "Format not suported!"), false);
//       else cb(null, true);
//     },
//   }).any(),
//   async (req, res, next) => {
//     const errorList = validationResult(req);
//     if (!errorList.isEmpty()) {
//       next(createHttpError(400, { errorList }));
//     } else {
//       console.log(await req.files);
// VARIABLES
// let author = converString(req.body.author);
// let readTime = converString(req.body.readTime);
// let postId = uniqid();
// let authorId = author._id;
// let coverId = "";
// let avatarId = "";
// Avatar SAVE
// if (req.files.authimg) {
//   let typeFile = req.files.authimg[0].originalname
//     .split(".")
//     .reverse()[0];
//   avatarId = `http://localhost:3003/img/authors/${authorId}.${typeFile}`;
//   await saveAuthrPic(
//     `${authorId}.${typeFile}`,
//     req.files.authimg[0].buffer
//   );
//   author.avatar = avatarId;
// } else {
//   avatarId = req.body.author.avatar;
//   author.avatar = avatarId;
// }
// Cover SAVE
// if (req.files.coverImg) {
//   let typeFile = req.files.coverImg[0].originalname
//     .split(".")
//     .reverse()[0];
//   coverId = `http://localhost:3003/img/covers/${postId}.${typeFile}`;
//   await saveCoverrPic(
//     `${postId}.${typeFile}`,
//     req.files.coverImg[0].buffer
//   );
//   coverId = req.body.cover;
// } else {
//   console.log("else");
//   coverId = req.body.cover;
// }
// CREATE NEW AUTHOR IF NOT EXIST
// let authorLib = await getAuthor();
// let checkAuthor = authorLib.filter((auth) => auth._id == author._id);
// if (!checkAuthor) {
//   authorLib.push(author);
//   await writeAuthor(authorLib);
// }
// new post
// try {
//   const newPost = {
//     ...req.body,
//     cover: coverId,
//     author: author,
//     readTime: readTime,
//     comments: [],
//     _id: postId,
//     createdAt: new Date(),
//   };
//   const posts = await getPost();
//   posts.push(newPost);
//   await writePost(posts);
//   res.status(200).send("Success!");
// } catch (error) {
//   next(createHttpError(400, "Bad request"));
// }
//     }
//   }
// );
