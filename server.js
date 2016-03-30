'use strict';

function validateString(str)
{
    return true;
}

const Hapi = require('hapi');

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
    validate: {
        payload: {
            from: validateString(),
            to: validateString()
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
