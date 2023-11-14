import nodemailer from 'nodemailer';

const SendEmail = (email, unique) => {
  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "ahsnkhalid1027@gmail.com",
      pass: "drek mbxf mouf xmiw"
    }
  })

  const mailoptions = {
    from: "ahsnkhalid1027@gmail.com",
    to: email,
    subject: 'Email confirmation',
    text: 'That was easy!',
    html: `Press <a href="http://localhost:3000/new-password?token=${unique}">here</a> to verify the email.`
  };

  transport.sendMail(mailoptions, function (error) {
    if (error) {
      console.log('\n\n Error', error);
    } else {
      console.log('\n\n Success', 'success');
    }
  })
}

export default SendEmail;