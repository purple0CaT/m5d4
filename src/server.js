import express from "express";
import cors from "cors";
import { join } from "path";

import listEndpoints from "express-list-endpoints";
import postStirve from "./services/posts/posts.js";
import authorStrive from "./services/authors/authors.js";
import {
  genericErrHandl,
  notFoundErrHandl,
  forbiddenFoundErrHandl,
  badreqFoundErrHandl,
} from "./errorHandler.js";

// === Serve CORS ===
const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whiteList.indexOf(origin) != -1) {
      next(null, true);
    } else {
      next(new Error("Origin not allowed!"));
    }
  },
};
// === Server ===
const server = express();
const port = process.env.PORT;
const publicFolderPath = join(process.cwd(), "public");

// === COnfiguration | Before endpoints! ===
server.use(express.static(publicFolderPath));
// body converter
server.use(cors(corsOptions));
server.use(express.json());
// ==== ROUTES / ENDPOINTS ====
server.use("/authors", authorStrive);
server.use("/blogPosts", postStirve);
// ERROR MIDDLEWARE
server.use(badreqFoundErrHandl);
server.use(forbiddenFoundErrHandl);
server.use(notFoundErrHandl);
server.use(genericErrHandl);
// Listen
server.listen(port, () => {
  console.log(port);
});
console.table(listEndpoints(server));
