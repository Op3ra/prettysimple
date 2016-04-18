'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Gift = require('./gift.js')

function handle_gift(request, reply) {
    const from = encodeURIComponent(request.payload.from);
    const to = encodeURIComponent(request.payload.to);
    var gift = new Gift.Gift(from, to);
    if (request.payload.action == 'give')
        gift.give(reply);
    else if (request.payload.action == 'claim')
        gift.claim(reply);
}

function list_gifts(request, reply) {
    const user = request.params.user ? encodeURIComponent(request.params.user) : 'all';
    reply('list: ' + user);
}

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/gift/{user?}',
    handler: list_gifts
});

server.route({
    method: 'POST',
    path: '/gift',
    handler: handle_gift,
    config: {
        validate: {
            payload: {
                from: Joi.string().guid().required(),
                to: Joi.string().guid().required(),
                action: Joi.any().valid('claim', 'give').required()
            }
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
