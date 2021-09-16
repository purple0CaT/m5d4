import express from "express";
import cors from "cors";

import listEndpoints from "express-list-endpoints";
import postStirve from "./posts/posts.js";
// import authorStrive from "./authors/authors.js";
import {
  genericErrHandl,
  notFoundErrHandl,
  forbiddenFoundErrHandl,
  badreqFoundErrHandl,
} from "./errorHandler.js";
// === Server ===
const server = express();
const port = 3003;

// === COnfiguration | Before endpoints! ===
// body converter
server.use(cors());
server.use(express.json());
// ==== ROUTES / ENDPOINTS ====
// server.use("/authors", authorStrive);
server.use("/blogPosts", postStirve);
// ERROR MIDDLEWARE
server.use(badreqFoundErrHandl);
server.use(forbiddenFoundErrHandl);
server.use(notFoundErrHandl);
server.use(genericErrHandl);
// Listen
server.listen(port, () => {});
console.table(listEndpoints(server));
