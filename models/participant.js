const { model, Schema } = require('mongoose');
const moment = require('moment');

const ParticipantSchema = Schema({
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
    invitation: {
        type: Schema.Types.ObjectId,
        ref: 'Invitation',
        default: null
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

ParticipantSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Participant', ParticipantSchema);