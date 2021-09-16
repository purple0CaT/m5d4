import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// =
const { readJSON, writeJSON, writeFile } = fs;
// path Posts
const postsFolder = join(dirname(fileURLToPath(import.meta.url)), "./posts");
export const postsJson = join(postsFolder, "postsLib.json");
// Posts
export const getPost = () => readJSON(postsJson);
export const writePost = (content) => writeJSON(postsJson, content);
// path Author
const authorFolder = join(dirname(fileURLToPath(import.meta.url)), "./authors");
const authorJson = join(authorFolder, "authorsLib.json");
// Posts
export const getAuthor = () => readJSON(authorJson);
export const writeAuthor = (content) => writeJSON(authorJson, content);

// = FILES
const publFolderPath = join(process.cwd(), "/public/img/students");
export const saveStudPic = (name, contentBuffer) =>
  writeFile(join(publFolderPath, name), contentBuffer);
