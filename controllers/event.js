const Event = require('../models/event');
const Participant = require('../models/participant');
const Invitation = require('../models/invitation');
const moment = require('moment');

const createEvent = async (req, res) => {
    const { title, description, region, visibility, eventStart, eventEnd } = req.body;
    const event = new Event({ title, description, region, visibility, eventStart, eventEnd });

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

const getMyPublicEvents = async (req, res) => {
    const { _id: uid } = req.user;
    const query = { status: true, user: uid };

    const participations = await Participant.find(query)
                                                .populate({
                                                    path: 'event',
                                                    populate: {
                                                        path: 'region',
                                                        model: 'Region'
                                                    }
                                                });
    let events = participations.map(participation => participation.event);
    let eventsFilter = events.filter(event => (event.status && event.visibility === 0));

    return res.json(eventsFilter);
}

const getMyPrivateEvents = async (req, res) => {
    const { _id: uid } = req.user;
    const query = {status: true, user: uid, statusInvitation: 2};

    const invitationsDB = await Invitation.find(query)
                                           .populate({
                                               path: 'event',
                                               populate: {
                                                   path: 'region',
                                                   model: 'Region'}});
    let events = invitationsDB.map(invitation => invitation.event);
    let eventsFilter = events.filter(event => (event.status && event.visibility === 1));

    res.json(eventsFilter);        
}

const getMyEventsCalendar = async (req, res) => {
    const { _id: uid } = req.user;
    const query = { user: uid, status: true };

    const myParticipations = await Participant.find(query)
    .populate({
        path: 'event',
        populate: {
            path: 'region',
            model: 'Region'
        }
    });
    let eventsParticipation = myParticipations.map(participation => participation.event);
    let eventsFilter = eventsParticipation.filter(event => event.status);
    let eventsCalendar = eventsFilter.map(event => ({ 
        _id: event._id, 
        title: event.title, 
        start: event.eventStart, 
        end: event.eventEnd 
    }));
    
    res.json(eventsCalendar);
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

const filterEvents = async (req, res) => {
    const { eventStart = null, region = null } = req.body;
    let filter = {};

    if (eventStart !== null) filter.eventStart = eventStart;
    if (region !== null) filter.region = region;

    filter.status = true;
    filter.visibility = 0;
    const events = await Event.find(filter)
                              .populate('region', 'city');
    
    res.json(events);
}

module.exports = {
    createEvent,
    getEvents,
    getEventsByRegion,
    getMyEventsCalendar,
    getMyPublicEvents,
    getMyPrivateEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    filterEvents
}