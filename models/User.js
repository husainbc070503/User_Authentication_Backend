const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/16/16363.png?w=740&t=st=1685556919~exp=1685557519~hmac=dd01fffcf3b26b1653b5fdebbd2b23db6262e05fd28b9f21b247d87bf118c3b5"
    },

    skills: [{
        type: String
    }],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password'))
            return next();

        const salt = await bcryptjs.genSalt(10);
        const secPassword = await bcryptjs.hash(user.password, salt);
        user.password = secPassword;

    } catch (error) {
        next(error);
    }
});

UserSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
        },
            process.env.JWT_SECRET, {
            expiresIn: "10d"
        });
    } catch (error) {
        console.error(error.message);
    }
}

UserSchema.methods.validatePassword = async function (password) {
    try {
        const res = await bcryptjs.compare(password, this.password);
        return res;
    } catch (error) {
        console.error(error.message);
    }
}

const User = mongoose.model('user', UserSchema);
module.exports = User;