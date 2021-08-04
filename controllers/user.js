const bcryptjs = require('bcryptjs');
const CryptoJS = require("crypto-js");

const User = require('../models/user');
const { sendMail, generateJWT } = require('../helpers');


const createUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    const user = new User({fullname, email, password});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();
    const token = await generateJWT(user._id);

    res.json({
        user,
        token
    });
}

const getUsers = async (req, res) => {
    const query = {status: true, _id: {$ne: req.user._id}};
    
    const users = await User.find(query);
    res.json(users);
}

const recoveryPassword = async (req, res) => {
    const { email } = req.body;

    //const encryptedEmail = CryptoJS.DES.encrypt(email, process.env.SECRET_CRYPTO);
    const actualDate = new Date();
    //const encryptedExpirateIn = CryptoJS.AES.encrypt((new Date().getTime() + 500).toString(), process.env.SECRET_CRYPTO);
    const expiresIn = new Date(actualDate.getTime() + 10*60000).getTime(); // 10 minutes
    
    // const encryptedExpirateIn = Buffer.from((new Date().getTime() + 500).toString()).toString('base64'); 

    const templateMail = `
    <div style="width: 400px">
        <h2 style="background-color: #6131DD; color: #FFF; padding: 5px 20px;">PartyU Recovery Password</h2>
      
            <p>You request a recovery password. If you don't, please ignore this message</p>
            <p>To recover your password, you must click the following link:</p>
            <a href="http://localhost:4200/auth/recover-password?email=${email}&expiresIn=${expiresIn}"> Recover password </a>

    </div>
    `;

    try {
        await sendMail(email, 'PatyU - Recover Password', templateMail);
        res.json({ message: `The email was send to ${email}` });

    } catch (errorMessage) {
        res.status(500).json({ message: errorMessage });
    }
   
}

const getProfileUser = async (req, res) => {
    const { _id: uid } = req.user;
    const user = await User.findById(uid);
  
    res.json(user);
}


const changePassword = async (req, res) => {
    const { email, password, expiresIn } = req.body;
    
    let actualDate = new Date().getTime();
   //  let emailDesencrypted = CryptoJS.AES.decrypt(email, process.env.SECRET_CRYPTO).toString(CryptoJS.enc.Utf8);
    // let expiresInDesencrypted = Number(CryptoJS.AES.decrypt(JSON.stringify({ expiresIn }), process.env.SECRET_CRYPTO).toString(CryptoJS.enc.Utf8));
    // let expiresInDesencrypted = Number(Buffer.from(expiresIn, 'base64').toString('ascii'));

    // Verify if the URL has expired
    if (actualDate >= expiresIn ) {
        return res.status(400).json({
            message: 'The URL has expired'
        });
    }
    
    // Verify that user is registered in the platform
    const userEmail = await User.findOne({ email });
    if (!userEmail) return res.status(404).json({ message:`The user ${email} is not registered` });

    // Verify that user is available
    if (!userEmail.status) return res.status(400).json({ message: `The user ${email} is not available` });

    // Change user password
    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(password, salt);

    const user = await User.findOneAndUpdate({ email }, { password: hash }, {new: true});
    res.json(user);

}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if ( id != req.user._id) {
        return res.status(403).json({
            message: 'You are not allowed to access here'
        });
    }

    const user = await User.findByIdAndUpdate(id, {status: false}, {new: true});
    
    res.json(user);
}

module.exports = {
    createUser,
    recoveryPassword,
    changePassword,
    deleteUser,
    getProfileUser,
    getUsers,
}