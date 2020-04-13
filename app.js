require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.locals.layout = false;
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.values.name}</li>
      <li>Email: ${req.body.values.email}</li>
      <li>Phone: ${req.body.values.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.values.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Node Mailer Server" <test@chrisdelmedia.com>', // sender address
    to: 'chrisdel@protonmail.com', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
  res.status(200).send("Success");
});
const port = process.env.PORT || 7000;
app.listen(port, () => console.log('server start', port));
