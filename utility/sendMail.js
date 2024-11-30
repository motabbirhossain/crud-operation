const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendMail = async (to, subject, data = { }) => {

    const { name, email, token, phone } = data;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from:`"Account Verify"<${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border: 1px solid #dddddd;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 10px;
                        text-align: center;
                    }

                    .content {
                        padding: 20px;
                    }

                    .footer {
                        background-color: #f4f4f4;
                        color: #666666;
                        padding: 10px;
                        text-align: center;
                        font-size: 12px;
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Our Service</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${name}!</p>
                        <p>Thank you for joining our service. We are excited to have you on board.</p>
                        <p>Your Email ${email}</p>
                        <p>Your Phone ${phone}</p>
                        <a href="http://127.0.0.1:3000/student/verified/${token}">Varifyed</a>
                        <p>If you have any questions, feel free to reply to this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>

            </html>
        `
    });

}

module.exports = { 
    sendMail
};