const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports.helpEmail = body =>{
    let email = body.email;
    let text = body.text;
    
    let mailOptions = options(email, text);
    send(mailOptions);
};

module.exports.sendToken = user =>{
    let email = user.email;
    let text = `click here to confirm your account <a>${user.token}<a/>`;
    let token = user.token;
    
    let mailOptions = options(email, text, token);
    send(mailOptions);
};

function send(mailOptions){
    transporter.sendMail(mailOptions)
    .then(()=>{
        console.log('email sent');   
    })
    .catch(error =>{
        console.log(error);
    });
}

function options(email, text, token){
    if (token) {
        return {
            from: process.env.EMAIL,
            to: email,
            subject: email,
            text: text,
            html: `click <a href="http://localhost:3000/users/confirm?token=${token}"> here </a> to confirm account`
        };
    } else{
        return {
            from: process.env.EMAIL,
            to: email,
            subject: email,
            text: `${email} ${text}`,
        };
    }
}
