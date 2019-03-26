var nodemailer = require('nodemailer');

exports.sendmail= function(dest, reaction) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'arealyon18@gmail.com',
            pass: 'samthol69'
        }
    });
    var mailOptions = {
        from: 'area@area.com',
        to: dest,
        subject: 'Someone reacted to your message',
        text: 'Someone added '+reaction+' reaction to your message: '
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
