const Participant = require('../models/participant');

const attendToEvent = async (req, res) => {
    const { event } = req.body;
    const user = req.user._id;

    // Verify if there is not repeated participants in an event
    const participantDB = await Participant.findOne({ user, event }); 
    if (participantDB && participantDB.status === true) return res.status(400).json({ message: 'You have checked your participantion on this event' });
    if (participantDB && participantDB.status === false) {
        let participant = await Participant.findByIdAndUpdate(participantDB._id, {status: true}, {new: true});
        return res.json(participant);
    } 

    // In other case, create new Participant in data base
    const participant = new Participant({ user, event });
    await participant.save();
    return res.json(participant);
}

const notAttendToEvent = async (req, res) => {
    const { event } = req.body;
    const { _id: uid } = req.user;

    const participantDB = await Participant.findOne({ event, user: uid});

    const participant = await Participant.findByIdAndUpdate(participantDB._id, {status: false}, {new: true});
    res.json(participant);
}

const listParticipants = async (req, res) => {
    const { eventID } = req.params;
    const query = { status: true, event: eventID };

    const [total, participants] = await Promise.all([
        Participant.countDocuments(query),
        Participant.find(query)
                   .populate('event', 'title description status')
                   .populate('user', 'fullname status')
    ]);

    res.json({
        total,
        participants
    });
}

const getMyParticipations = async (req, res) => {
    const { _id: uid } = req.user;

    const query = { user: uid, status: true };
    const participations = await Participant.find(query);

    res.json(participations);
}


module.exports = {
    attendToEvent,
    notAttendToEvent,
    listParticipants,
    getMyParticipations,
}