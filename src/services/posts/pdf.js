import PdfPrinter from "pdfmake";
import base64url from "base64-url";
// import parse from "node-html-parser";
// import HTMLParser from "node-html-parser";
import { convert } from "html-to-text";

export const getPdfStream = (data) => {
  const imageUrl = base64url.encode(data.cover);
  console.log(`data:image/jpeg;base64,` + imageUrl);
  // =

  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      //   italics: "fonts/Roboto-Italic.ttf",
      //   bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };
  const printer = new PdfPrinter(fonts);
  const docDefinition = {
    // ...
    content: [
      {
        text: "Here shoud be an image! \n\n",
        // image: `data:${imageUrl}/jpeg;base64`,
      },
      {
        text: `${data.title} \n\n`,
        style: "header",
      },
      {
        text: convert(data.content, {
          wordwrap: 130,
        }),
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

  return pdfDoc;
};
// pdfDoc.pipe(fs.createWriteStream("document.pdf"));
// pipeline(pdfDoc, fs.createWriteStream("document.pdf"));
