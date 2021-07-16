const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");


module.exports.SignUp = async (data) => {
    console.log(sgMail)
    try {
        const msg = {
            to: data.email,
            from: 'pavansurya21@gmail.com',
            subject: `${data.subject}`,
            text: `${data.text}`,
            html: `<p> Your validate code is ${data.code}.</p>`,
        };
        const resp = await sgMail.send(msg);
    } catch (err) {
        console.log(err.response)
    }
};

module.exports.setpOne = async (data) => {
    console.log(sgMail)
    try {
        const msg = {
            to: data.email,
            from: 'pavansurya21@gmail.com',
            subject: `${data.subject}`,
            text: `${data.text}`,
            html: `<p> Your Forget passcode code is ${data.code}.</p>`,
        };
        const resp = await sgMail.send(msg);
    } catch (err) {
        console.log(err.response)
    }
};