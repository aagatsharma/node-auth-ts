import nodemailer from "nodemailer";

export const sendEmail = async (email: string, link: string) => {
  const USER = process.env.NODEMAILER_USER;
  const PASS = process.env.NODEMAILER_PASS;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: USER,
        pass: PASS,
      },
    });
    await transporter.sendMail({
      from: USER,
      to: email,
      subject: "Verify your account",
      text:
        "Hello,\n Welcome. Please click on the link to verify your account.\n" +
        link,
      html: `<a href="${link}">Verify Email.</a>`,
    });
  } catch (error: any) {
    // return error;
    console.error("Error", error.message);
  }
};
