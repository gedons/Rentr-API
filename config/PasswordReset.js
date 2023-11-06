const transport = require('./emailConfig');
const crypto = require('crypto');

// Generate a random password token
const generateResetToken  = () => {
    return crypto.randomBytes(20).toString('hex');
};

const sendResetEmail = (user) => {
    const token = generateResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    user.save();

    const mailOptions = {
        from: 'rentrsend@mail.com',
        to: user.email,
        subject: 'Password Reset',
        html: `
            <div class="bg-gray-100 p-4">
            <h2 class="text-2xl font-semibold mb-4">Hello</h2>
            <p class="mb-4 font-semibold">To reset your password, click the following link:</p>
            <a href="http://localhost:3000/api/v1/auth/reset/${token}" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600">
              Reset Password
            </a>
            <p class="mt-3 font-weight:100">Reset Link expires in 1 hour</p>
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

module.exports = {generateResetToken, sendResetEmail};
