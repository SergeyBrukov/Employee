import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

const transporter = createTransport({
  // service: 'gmail',
  // host: 'smtp.gmail.com',
  // port: 993,
  // secure: false,
  service: 'Gmail',
  auth: {
    user: "sdiomant@gmail.com",
    pass: "byxkyznllhdvzxyp"
  }
}, {
  from: "Main email <sdiomant@gmail.com>"
});

const handlebarsOption = hbs({
  viewEngine: {
    extName: ".hbs",
    partialsDir: "mailer/mail-templates",
    layoutsDir: "mailer/mail-templates",
    defaultLayout: false
  },
  viewPath: "mailer/mail-templates", // шлях до директорії з шаблонами
  extName: ".hbs"
});

transporter.use("compile", handlebarsOption);

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log(err);
    }

    console.log(info);
  });
};

export default mailer;