const transport = require('./emailConfig');
const crypto = require('crypto');

// Generate a random verification token (you can use a library like `crypto` to create a secure token)
const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

const sendVerificationEmail = (user) => {
    const token = generateVerificationToken();
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 20 * 60 * 1000;
    user.save();

    const mailOptions = {
        from: 'rentrsend@mail.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
            <div class="bg-gray-100 p-4">
            <h2 class="text-2xl font-semibold mb-4">Welcome to RenTr</h2>
            <p class="mb-4 font-semibold">Thank you for registering. Please click the button below to verify your email address:</p>
            <a href="http://localhost:3000/api/v1/auth/verify/${token}" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600">
              Verify Email
            </a>
            <p class="mt-3 font-weight:100">Verification code expires in 20 minutes</p>
            </div>
        `
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { generateVerificationToken, sendVerificationEmail };
