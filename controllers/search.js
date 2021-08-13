const { ObjectId } = require('mongoose').Types;
const Event = require('../models/event');

const allowedCollections = [
    'events'
]

const searchEvents = async (term = '', res) => {

    const isValidId = ObjectId.isValid(term);

    // If the term is a valid Mongo ID
    if (isValidId) {
        const event = await Event.findById(term)
                                 .populate('region', 'city');
        return res.json({
            results: (event && event.status && event.visibility === 0) ? res.json([ event ]) : []
        });
    }

    // If the term is just anything else
    const regex = new RegExp(term, 'i');
    const events = await Event.find({ 
        $and: [{title: regex}, {status: true}, {visibility: 0}] 
    }).populate('region', 'city');

    res.json({
        results: events
    });



}


const search = (req, res) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            message: `The collection is not valid. Valid collections: ${ allowedCollections }`
        });
    }

    switch(collection) {
        case 'events':
            searchEvents(term, res);
        break;
        default:
            res.status(400).json({
                message: `The collection is not valid. Valid collections: ${ allowedCollections }`
            });
    }
}

module.exports = {
    search,
}