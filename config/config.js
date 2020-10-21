require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const development = {
    app: {
        port: 3000,
        secretKey: process.env.SECRET_KEY,
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: process.env.CALLBACK_URL
    },
    db: {
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        port: process.env.DB_PORT_DEV,
        host: process.env.DB_HOST_DEV,
        name: process.env.DB_NAME_DEV
    }
};

const test= {
    app: {
        port: 3000,
        secretKey: process.env.SECRET_KEY,
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: process.env.CALLBACK_URL
    },
    db: {
        port: process.env.DB_PORT_TEST,
        host: process.env.DB_HOST_TEST,
        name: process.env.DB_NAME_TEST
    }
};

const staging = {
    app: {
        port: 3000,
        secretKey: process.env.SECRET_KEY,
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: process.env.GCALLBACK_URL
    },
    db: {
        database_url: process.env.DATABASE_URL
    }
};

const production = {
    app: {
        port: process.env.PORT,
        secretKey: process.env.SECRET_KEY,
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: process.env.CALLBACK_URL
    },
    db: {
        database_url: process.env.DATABASE_URL
    }
};

const config = {
    development,
    test,
    staging,
    production
};

module.exports = config[env]