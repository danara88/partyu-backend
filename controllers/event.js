const Event = require('../models/event');
const Participant = require('../models/participant');
const Invitation = require('../models/invitation');
const moment = require('moment');

const createEvent = async (req, res) => {
    const { title, description, region, visibility } = req.body;
    const event = new Event({ title, description, region, visibility });

    await event.save();
    res.json(event);
}

const getEvents = async (req, res) => {
    const { from = 0, limit = 15 } = req.query;
    const query = { status: true, visibility: 0 };

    const [total, events] = await Promise.all([
        Event.countDocuments(query),
        Event.find(query).sort('-createdAt').populate('region', 'city')
                         .skip(Number(from))
                         .limit(Number(limit))
    ]); 

    res.json({
        total,
        events
    });
}

const getEventsByRegion = async (req, res) => {
    const { regionID } = req.params;
    const query = { status: true, region: regionID };

    const [total, events] = await Promise.all([
        Event.countDocuments(query),
        Event.find(query).populate('region', 'city')
    ]);

    res.json({
        total,
        events
    });
}

const getMyEventsParticipation = async (req, res) => {
    const { _id: uid } = req.user;
    const { eventsformat = false } = req.query;
    
    const query = { user: uid, status: true };
    const myParticipations = await Participant.find(query);

    if (eventsformat) {
        const myParticipations = await Participant.find(query)
                                                  .populate({
                                                      path: 'event',
                                                      populate: {
                                                          path: 'region',
                                                          model: 'Region'
                                                      }
                                                  });
        let events = myParticipations.map(participation => participation.event);
        let eventsFilter = events.filter(event => event.status);
        return res.json(eventsFilter);
    }

    res.json(myParticipations);
}

const getEvent = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id).populate('region', 'city');
    
    res.json(event);
}

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { _id, status, createdAt, updatedAt, ...data } = req.body;
    data.updatedAt = moment().unix();

    const event = await Event.findByIdAndUpdate(id, data, {new: true}).populate('region', 'city');
    res.json(event);
}

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    
    const invitationsDB = await Invitation.find({ event: id });

    if (invitationsDB.length > 0) {
        invitationsDB.forEach(async ({_id: id}) => {
            try {
                await Invitation.findByIdAndUpdate(id, {status: false});
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: 'Something went wrong ...' });
            }
        });
    }

    const event = await Event.findByIdAndUpdate(id, {status: false}, {new: true}).populate('region', 'city');
    res.json(event);

    
}

module.exports = {
    createEvent,
    getEvents,
    getEventsByRegion,
    getMyEventsParticipation,
    getEvent,
    updateEvent,
    deleteEvent
}