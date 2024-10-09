const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/usermodel');
const Transporter = require('../middleware/transporter');

exports.UserSignup = async (req, res) => {
    const { First_Name, Last_Name, Email, Password } = req.body;
    try {
        // const usermail = await UserModel.findOne({Email});
        // if(usermail){
        //     res.status(404).json({message: 'email already exist'})
        // }
        const hashedPassword = await bcrypt.hash(Password, 12);
        const createUser = await UserModel.create({
            First_Name: First_Name,
            Last_Name: Last_Name,
            Email: Email,
            Password: hashedPassword,
        });
        const token = jwt.sign({ id: createUser._id, Email: createUser.Email }, process.env.JWT_SECRET)
        await createUser.save();
        res.status(201).json({ message: "User signup successfully", createUser, token });
    } catch (error) {
        res.status(404).json({ message: "User signup failed", error: error.message });
        console.log("User signup failed:", error);
    }
};

exports.loginUser = async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email,Password)

    try {

        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await UserModel.findOne({ Email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id, Email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
        console.error("Login failed:", error);
    }
};

exports.SendResetPasswordEmail = async (req, res) => {
    const { Email } = req.body;

    try {
        const user = await UserModel.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }
        const token = jwt.sign(
            { userId: user._id, Email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const mailOptions = {
            from: process.env.HOST_MAIL,
            to: Email,
            subject: "Reset Password",
            text: `This is your reset password link:\n${token}`
        };
        await Transporter.sendMail(mailOptions)
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Failed to send reset email:", error);
        return res.status(500).json({ message: "Failed to send reset email", error: error.message });
    }
};
exports.changePassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = tokenDetails;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { Password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        return res.status(500).json({ message: "Password change failed", error: error.message });
    }
};