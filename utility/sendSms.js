const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const sendSms = (to, message) => {
    const formattedTo = to.startsWith('+') ? to : `+${to}`;
    client.messages
        .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            body: message,
            to: formattedTo,
        })
        .then((message) => {
            console.log(message.sid);
            // res.status(200).send('SMS sent successfully');
        })
        .catch((error) => {
            console.error(error);
            // res.status(500).send('Failed to send SMS');
        });
}


module.exports = sendSms;

const sendVerification = async (phoneNumber) => {
    try {
        const verification = await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        return verification;
    } catch (error) {
        console.error('Error sending verification:', error);
        throw error;
    }
};

const checkVerification = async (phoneNumber, code) => {
    try {
        const verificationCheck = await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumber, code: code });
        return verificationCheck;
    } catch (error) {
        console.error('Error checking verification:', error);
        throw error;
    }
};

