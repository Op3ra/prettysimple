'use strict';

const Hapi = require('hapi');
const Joi = require('joi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path: '/gift/{user?}',
    handler: function (request, reply) {
        const user = request.params.user ? encodeURIComponent(request.params.user) : 'all';
        reply('list: ' + user);
    }
});

server.route({
    method: 'POST',
    path: '/gift',
    handler: function (request, reply) {
        const from = encodeURIComponent(request.payload.from);
        const to = encodeURIComponent(request.payload.to);
        reply('From: ' + from + ' <> To: ' + to);
    },
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

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
