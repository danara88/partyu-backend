const Invitation = require('../models/invitation');

const sendInvitation = async (req, res) => {
    const { updatedAt, createdAt, status, _id, statusInvitation, ...body } = req.body;

    const inviationDB = await Invitation.findOne({ event: body.event, user: body.user });
    if (inviationDB) return res.status(400).json({ message: 'You have already sent this invitation to the user' });

    const invitation = new Invitation(body);

    await invitation.save();
    res.json(invitation);
}

const rejectInvitation = async (req, res) => {
    const { invitationID } = req.params;

    const invitationDB = await Invitation.findById(invitationID);
    if (invitationDB.user.toString() != req.user._id.toString()) {
        return res.status(403).json({
            message: 'You are not allowed to access here'
        });
    }

    const invitation = await Invitation.findByIdAndUpdate(invitationID, {statusInvitation: 1}, {new: true});
    res.json(invitation);
}

const acceptInvitation = async (req, res) => {
    const { invitationID } = req.params;
    
    const invitationDB = await Invitation.findById(invitationID);
    if (invitationDB.user.toString() != req.user._id.toString()) {
        return res.status(403).json({
            message: 'You are not allowed to access here'
        });
    }

    const invitation = await Invitation.findByIdAndUpdate(invitationID, {statusInvitation: 2}, {new: true});
    res.json(invitation);
}

const getInvitations = async (req, res) => {
    const { from = 0, limit = 10 } = req.query;
    const { eventID } = req.params;

    const query = {status: true, event: eventID};

    const [total, invitations] = await Promise.all([
        Invitation.countDocuments(query),
        Invitation.find(query).populate('user', 'fullname createdAt email')
                              .populate('event', 'title description visibility status')
                              .skip(from)
                              .limit(limit)
    ]);

    res.json({
        total,
        invitations
    });
}

const myInvitations = async (req, res) => {
    const { from = 0, limit = 10 } = req.query;
    const user = req.user._id;

    const query = {status: true, user: user};

    const [total, invitations] = await Promise.all([
        Invitation.countDocuments(query),
        Invitation.find(query).populate('user')
                              .populate('event', 'title description visibility status')
                              .skip(Number(from))
                              .limit(Number(limit))
    ]);

    res.json({
        total,
        invitations
    });
}

const deleteInvitation = async (req, res) => {
    const { id } = req.params;
    
    const invitation = await Invitation.findByIdAndUpdate(id, {status: false}, {new: true});

    res.json(invitation);
}

module.exports = {
    sendInvitation,
    rejectInvitation,
    acceptInvitation,
    getInvitations,
    deleteInvitation,
    myInvitations
}