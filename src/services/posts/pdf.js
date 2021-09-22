import PdfPrinter from "pdfmake";
import axios from "axios";
import striptags from "striptags";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    //   italics: "fonts/Roboto-Italic.ttf",
    //   bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
const printer = new PdfPrinter(fonts);

export const getPdfStream = async (data) => {
  // Fetching data
  const response = await axios.get(data.cover, {
    responseType: "arraybuffer",
  });
  const blogCoverURLParts = data.cover.split("/").reverse();
  const [extension, id] = blogCoverURLParts[0].split(".").reverse();
  const base64 = response.data.toString("base64");
  const base64Image = `data:image/${extension};base64,${base64}`;

  const docDefinition = {
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
  const options = {
    // ...
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.end();
  console.log(1);

  return pdfDoc;
};
// pdfDoc.pipe(fs.createWriteStream("document.pdf"));
// pipeline(pdfDoc, fs.createWriteStream("document.pdf"));
