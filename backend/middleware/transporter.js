const nodemailer = require("nodemailer")
const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.PASS_KEY
    }
})
module.exports = Transporter