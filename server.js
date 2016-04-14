'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Gift = require('./gift.js')
require('env2')('config.env');

function handle_gift(request, reply) {
    const from = encodeURIComponent(request.payload.from);
    const to = encodeURIComponent(request.payload.to);
    var gift = new Gift.Gift(from, to);
    gift.give();
    reply('From: ' + from + ' <> To: ' + to);
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

server.register({
    register: require('hapi-postgres-connection')}
    , function (err) {
        if (err)
            console.log('Error while loading database connector : ' + err);
        else
            console.log('Database connector loaded succesfully.');
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

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

