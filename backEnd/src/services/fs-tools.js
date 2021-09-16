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
// = Authors
const authrFolderPath = join(process.cwd(), "/public/img/authors");
export const avatarPath = "http://localhost:3003/img/authors";
export const saveAuthrPic = (name, content) => {
  writeFile(join(authrFolderPath, name), content);
};
// = covers
const coversFolderPath = join(process.cwd(), "/public/img/covers");
export const coverPath = "http://localhost:3003/img/covers";
export const saveCoverrPic = (name, content) => {
  writeFile(join(coversFolderPath, name), content);
};
