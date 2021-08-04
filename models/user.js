const { Schema, model } = require('mongoose');
const moment = require('moment');

const UserSchema = Schema({
    fullname: {
        type: String,
        required: [true, 'Your full name is required']
    },
    email: {
        type: String,
        required: [true, 'Your email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        default: 'ROLE_USER',
        enum: ['ROLE_USER', 'ROLE_ADMIN']
    },
    status: {
        type: Boolean,  
        default: true
    },
    createdAt: {
        type: String,
        default: moment().unix()
    },
    updatedAt: {
        type: String,
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
}

module.exports = model('User', UserSchema);



