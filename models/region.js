const { model, Schema } = require('mongoose');
const moment = require('moment');

const RegionSchema = Schema({
    city: {
        type: String,
        required: [true, 'City name is required']
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

RegionSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Region', RegionSchema);