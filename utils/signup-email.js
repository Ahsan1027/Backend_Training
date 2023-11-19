import nodemailer from 'nodemailer';

const SignupEmail = (email, unique) => {
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
    subject: 'Signup Email confirmation',
    text: 'That was easy!',
    html: `Click <a href="http://localhost:3000/user-verifying?token=${unique}">here</a> to verify your account.`
  };

  transport.sendMail(mailoptions, function (error) {
    if (error) {
      console.log('\n\n Error', error);
    } else {
      console.log('\n\n Success', 'success');
    }
  })
}

export default SignupEmail;