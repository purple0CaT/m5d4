import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILADRESS,
    pass: process.env.EMAILPASS,
  },
});
export const sendMssg = async (email, file) => {
  const messg = {
    from: process.env.EMAILADRESS,
    to: email,
    subject: "PDF | Strive Blog",
    // text: "Plaintext version of the message",
    html: "<h2>Your PDF document</h2>",
    attachments: [
      {
        filename: "PDF.pdf",
        content: file,
      },
    ],
  };
  transporter.sendMail(messg, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info.response);
  });
};
