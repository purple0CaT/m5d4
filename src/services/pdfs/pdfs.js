import express from "express";
import { getPost } from "../fs-tools.js";
import { getPdfStream } from "./tools.js";
import { pipeline } from "stream";
import { sendMssg } from "./sendE.js";
import mailgun from "mailgun-js";
import fs from "fs-extra";
// def val
// ===
const pdfsSend = express.Router();

// SAVE PDF
pdfsSend.get("/:postId/savePDF", async (req, res, next) => {
  try {
    const posts = await getPost();
    const post = posts.filter((pt) => pt._id == req.params.postId);
    res.setHeader("Content-Disposition", "atachment; filename=Post.pdf");
    const source = await getPdfStream(post[0]);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) next(err);
    });
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
    // res.setHeader("Content-Disposition", "atachment; filename=Post.pdf");
    // let file = "";
    const source = await getPdfStream(post[0]);
    // const destination = file;
    // pipeline(source, destination, (err) => {
    //   if (err) next(err);
    // });
    // console.log("Works");

    await sendMssg(email, source);
    console.log(source.body);
    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

export default pdfsSend;
