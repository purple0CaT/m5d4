import PdfPrinter from "pdfmake";
import axios from "axios";
import striptags from "striptags";
import { pipeline } from "stream";
import { promisify } from "util";
// DEF VALUES
const asyncPipeline = promisify(pipeline); // promisify is an utility which transforms a function that uses callbacks into a function that uses Promises (and so Async/Await). Pipeline is a function that works with callbacks to connect two or more streams together --> I can promisify pipeline getting back an asynchronous pipeline
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    //   italics: "fonts/Roboto-Italic.ttf",
    //   bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
const printer = new PdfPrinter(fonts);
// PDF STREAM
export const getPdfStream = async (data, res) => {
  // Fetching Post Data
  const response = await axios.get(data.cover, {
    responseType: "arraybuffer",
  });
  // Transforming Image
  const blogCoverURLParts = data.cover.split("/").reverse();
  const [extension, id] = blogCoverURLParts[0].split(".").reverse();
  const base64 = response.data.toString("base64");
  const base64Image = `data:image/${extension};base64,${base64}`;
  // DOCUMENT PDF CONTENT
  const docContent = {
    content: [
      {
        image: base64Image,
        width: 400,
      },
      {
        text: "\n\n",
      },
      {
        text: `${data.title} \n\n`,
        style: "header",
      },
      {
        text: striptags(data.content),
        lineHeight: 2,
      },
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true,
      },
    },
  };
  const options = {};
  //  CREATE / SAVE / SEND
  const pdfDoc = printer.createPdfKitDocument(docContent, options);
  pdfDoc.end();
  await asyncPipeline(pdfDoc, res);
};

// pdfDoc.pipe(fs.createWriteStream("document.pdf"));
// pipeline(pdfDoc, fs.createWriteStream("document.pdf"));

// export const getPdfStream = async (data) => {
//   const asyncPipeline = promisify(pipeline); // promisify is an utility which transforms a function that uses callbacks into a function that uses Promises (and so Async/Await). Pipeline is a function that works with callbacks to connect two or more streams together --> I can promisify pipeline getting back an asynchronous pipeline

//   // Fetching Post Data
//   const response = await axios.get(data.cover, {
//     responseType: "arraybuffer",
//   });
//   // Transforming
//   const blogCoverURLParts = data.cover.split("/").reverse();
//   const [extension, id] = blogCoverURLParts[0].split(".").reverse();
//   const base64 = response.data.toString("base64");
//   const base64Image = `data:image/${extension};base64,${base64}`;

//   const docDefinition = {
//     content: [
//       {
//         image: base64Image,
//         width: 400,
//       },
//       {
//         text: "\n\n",
//       },
//       {
//         text: `${data.title} \n\n`,
//         style: "header",
//       },
//       {
//         text: striptags(data.content),
//         lineHeight: 2,
//       },
//     ],
//     styles: {
//       header: {
//         fontSize: 15,
//         bold: true,
//       },
//     },
//   };
//   const options = {};
//   const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
//   pdfDoc.end();

//   return pdfDoc;
// };
