const sgMail = require('@sendgrid/mail');

/**
 * This method send emails via sendgrid
 */
const sendMail = (email = '', subject, html) => {
    return new Promise((resolve, reject) => {
        sgMail.setApiKey(process.env.SENDGRIDKEY);
        const msg = {
            to: email,
            from: 'daranda@webcreek.com',
            subject,
            html
        };

        sgMail.send(msg).then(() => {
            resolve(`The mail was send to ${email}`)
        }).catch((err) => {
            console.log(err);
            reject('We could not sent the message')
        });
    });
}

module.exports = {
    sendMail
}