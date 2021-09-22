import PdfPrinter from "pdfmake";

export const getPdfStream = () => {
  var fonts = {
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
    content: ["someparagr", "other staff"],
  };
  const options = {
    // ...
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.end();
  // return
  return pdfDoc;
};
// pdfDoc.pipe(fs.createWriteStream("document.pdf"));
// pipeline(pdfDoc, fs.createWriteStream("document.pdf"));
