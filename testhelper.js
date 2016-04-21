'use strict';

const DBHandle = require('./database');
var db = new DBHandle.DBHandle();

function create(request, reply) {
    const username = request.params.username;
    const city = request.params.city;

    var result = {};
    db.createUser(username).then(function(user_result) {
        var new_user_id = (user_result.get('id'));
        result['user'] = user_result.get({plain:true});
        db.createCity(city, new_user_id).then(function(city_result) {
            result['city'] = city_result.get({plain:true});
            reply(JSON.stringify(result));
        }).catch(function(err) {
            console.err(err);
            reply(JSON.stringify('Internal error while creating city.'));
        });
    }).catch(function(err) {
        console.err(err);
        reply(JSON.stringify('Internal error while creating user.'));
    });
}

module.exports.create = create;
var exports = module.exports;
