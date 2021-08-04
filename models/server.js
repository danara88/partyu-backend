const express = require('express');
const cors = require('cors');

const { connectDB } = require('../db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            user: '/api/users',
            auth: '/api/auth',
            region: '/api/regions',
            event: '/api/events',
            participant: '/api/participants',
            invitation: '/api/invitations',
        };

        this.middlewares();
        this.dbConnection();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    async dbConnection() {
        await connectDB();
    }

    routes() {
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.region, require('../routes/region'));
        this.app.use(this.paths.event, require('../routes/event'));
        this.app.use(this.paths.participant, require('../routes/participants'));
        this.app.use(this.paths.invitation, require('../routes/invitation'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running at port ', this.port);
        });
    }
}

module.exports = Server;