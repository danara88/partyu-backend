const { model, Schema } = require('mongoose');
const moment = require('moment');

const InvitationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The user is required']
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'The event is required']
    },
    message: {
        type: String,
        default: 'Hello! You are invited to my party'
    },
    statusInvitation: {
        type: Number,
        default: 0 // 0 ->pendient 1 -> rejected 2 -> accepted
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
        type: String
    }
});

InvitationSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Invitation', InvitationSchema);