const { Schema, model } = require('mongoose');
const { unix } = require('moment');

const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'Role name is required']
    },
    createdAt: {
        type: String,
        default: unix()
    },
    updatedAt: {
        type: String,
    }
});

RoleSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Role', RoleSchema);