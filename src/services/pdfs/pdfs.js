import express from "express";
import { getAuthor, getPost, getReadableStreamAuthr } from "../fs-tools.js";
import { getPdfStream } from "./tools.js";
import { pipeline } from "stream";
import { sendMssg } from "./sendE.js";
import fs from "fs-extra";
import json2csv from "json2csv";
import { promisify } from "util";
// def val
const asyncPipeline = promisify(pipeline); // promisify is an utility which transforms a function that uses callbacks into a function that uses Promises (and so Async/Await). Pipeline is a function that works with callbacks to connect two or more streams together --> I can promisify pipeline getting back an asynchronous pipeline
// ===
const pdfsSend = express.Router();

// SAVE PDF
pdfsSend.get("/:postId/savePDF", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "atachment; filename=Post.pdf");
    const posts = await getPost();
    const post = posts.filter((pt) => pt._id == req.params.postId);
    await getPdfStream(post[0], res);
    // const source = await getPdfStream(post[0]);
    // const destination = res;
    // pipeline(source, destination, (err) => {
    //   if (err) next(err);
    // });
  } catch (err) {
    next(err);
  }
});
// SAVE CVS
pdfsSend.get("/saveCSV", async (req, res, next) => {
  try {
    res.setHeader(
      "Content-Disposition",
      "atachment; filename=Strive Authors.csv"
    );
    const source = await getReadableStreamAuthr();
    const transform = new json2csv.Transform({
      fields: ["name", "avatar", "_id"],
    });
    const destination = res;
    await asyncPipeline(source, transform, destination);
    // pipeline(source, transform, destination, (err) => {
    //   if (err) next(err);
    // });
  } catch (err) {
    next(err);
  }
});

// SEND PDF BY EMAIL
pdfsSend.post("/:postId/sendPdfEmail", async (req, res, next) => {
  try {
    const { email } = req.body;
    const posts = await getPost();
    const post = posts.filter((pt) => pt._id == req.params.postId);
    const source = await getPdfStream(post[0], res, true);
    await sendMssg(email, source);
    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

export default pdfsSend;
