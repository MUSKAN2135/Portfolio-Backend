const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,
        trim: true
    },
    Last_Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        // lowercase: true,
        // match: [/\S+@\S+\.\S+/, 'Email is not valid']
    },
    Password: {
        type: String,
        required: [true, 'Password is required'],
        // minlength: [8, 'Password must be at least 8 characters long']
    }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
