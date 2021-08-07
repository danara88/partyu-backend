const { model, Schema } = require('mongoose');
const moment = require('moment');

const EventSchema = Schema({
    title: {
        type: String,
        required: [true, 'The title is required']
    },
    description: {
        type: String
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: [true, 'The region is required']
    },
    visibility: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    eventStart: {
        type: Date,
        required: [true, 'The event start is required']
    },
    eventEnd: {
        type: Date,
        required: [true, 'The event end is required']
    },
    createdAt: {
        type: String,
        default: moment().unix()
    },
    updatedAt: {
        type: String
    }
});

EventSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Event', EventSchema);