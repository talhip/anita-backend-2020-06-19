require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(formidable());

const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.post("/", (req, res) => {
  const { firstname, lastname, email, subject, message } = req.fields;

  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: process.env.MAILGUN_EMAIL_ACCOUNT,
    subject: subject,
    text: message,
  };

  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
