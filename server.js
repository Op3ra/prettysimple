'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Gift = require('./gift.js')

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Listing
server.route({
    method: 'GET',
    path: '/gift/list/from/{user}',
    handler: Gift.list_from
});
server.route({
    method: 'GET',
    path: '/gift/list/to/{user}',
    handler: Gift.list_to
});
server.route({
    method: 'GET',
    path: '/gift/list',
    handler: Gift.list_all
});

// Actions
server.route({
    method: 'POST',
    path: '/gift/claim',
    handler: Gift.claim,
    config: {
        validate: {
            payload: {
                from: Joi.string().guid().required(),
                to: Joi.string().guid().required(),
            }
        }
    }
});
server.route({
    method: 'POST',
    path: '/gift/give',
    handler: Gift.give,
    config: {
        validate: {
            payload: {
                from: Joi.string().guid().required(),
                to: Joi.string().guid().required(),
            }
        }
    }
});

server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
