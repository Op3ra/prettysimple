'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Gift = require('./gift');
const TestHelper = require('./testhelper');
const fs = require('fs');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Listing
server.route({
    method: 'GET',
    path: '/gift/list/from/{user}',
    handler: function(request, reply) {
        const user = encodeURIComponent(request.params.user);
        Gift.list_from(user, reply);
    }
});
server.route({
    method: 'GET',
    path: '/gift/list/to/{user}',
    handler: function(request, reply) {
        const user = encodeURIComponent(request.params.user);
        Gift.list_to(user, reply);
    }
});
server.route({
    method: 'GET',
    path: '/gift/list',
    handler: function(request, reply) { Gift.list_all(reply); }
});
server.route({
    method: 'GET',
    path: '/user/list',
    handler: function(request, reply) { Gift.list_users(reply); } // deferred to Gift from an hypothetic User module which handle users
});

// Actions
server.route({
    method: 'POST',
    path: '/gift/claim',
    handler: function(request, reply) {
        const from = encodeURIComponent(request.payload.from);
        const to = encodeURIComponent(request.payload.to);
        Gift.claim(from, to, reply);
    },
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
    handler: function(request, reply) {
        const from = encodeURIComponent(request.payload.from);
        const to = encodeURIComponent(request.payload.to);
        Gift.give(from, to, reply);
    },
    config: {
        validate: {
            payload: {
                from: Joi.string().guid().required(),
                to: Joi.string().guid().required(),
            }
        }
    }
});


// Access API documentation
server.route({
    method: 'GET',
    path: '/doc',
    handler: function(request, reply) {
        var docBuf = fs.readFileSync('doc.txt', {encoding: 'UTF-8'});
        reply('<pre>' + docBuf + '</pre>');
    }
});

// Testing
server.route({
    method: 'GET',
    path: '/test/create/{username}/{city}',
    handler: function(request, reply) {
        const username = request.params.username;
        const city = request.params.city;
        TestHelper.create(username, city, reply);
    }
});

server.start(function(err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
