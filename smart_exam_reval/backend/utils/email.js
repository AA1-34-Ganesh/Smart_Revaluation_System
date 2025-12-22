const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    let transporterConfig;

    if (process.env.EMAIL_PROVIDER === "gmail") {
        console.log(" Using Service: GMAIL (Real Emails)");
      transporterConfig = {
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      };
    } else {
      // Safety Check
      if (!process.env.MAILTRAP_HOST) {
        throw new Error(" MAILTRAP_HOST is missing in .env file");
      }
      
      transporterConfig = {
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      };
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: '"Smart Exam Admin" <admin@college.edu>',
      to: to,
      subject: subject,
      html: html, // We use HTML for beautiful templates
    };

    await transporter.sendMail(mailOptions);
    console.log(` Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("Email Failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;