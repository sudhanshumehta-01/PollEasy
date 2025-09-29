const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const crypto = require("crypto");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.json({ msg: "User already exists" });
        }
        else {
            user = new User({ name, email, password });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user = await user.save();
            return res.json({ msg: "User Registered Successfully" });
        }
    }
    catch (err) {
        console.error("Error saving user:", err);
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.json({ msg: "User doesn't exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ msg: "Invalid Credentials" });
        }

        const payload = {
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
                });
            }
        );
    } catch (err) {
        console.log("Error getting user:", err);
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, password } = req.body;

        const updatedData = { name, email };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");

        res.json({ success: true, updatedUser });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ success: false, msg: "Failed to update profile" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Hello ${user.name},</p>
                   <p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 1 hour.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: "Password reset link sent to your email." });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        console.log("User:", user);

        if (!user) return res.status(400).json({ msg: "Invalid or expired token." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ msg: "Password has been reset successfully." });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};