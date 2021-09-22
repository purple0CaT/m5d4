import PdfPrinter from "pdfmake";

export const getPdfStream = (data) => {
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
    content: [data.category, data.title, data.cover, data.content],
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
