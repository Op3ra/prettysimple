'use strict';

const DBHandle = require('./database.js');
var db = new DBHandle.DBHandle();

function compute_max_expiration()
{
    var max_expiration = new Date();
    max_expiration.setDate(max_expiration.getDate() + 7);
    return max_expiration;
}

function list(request, reply) {
    const user = request.params.user ? encodeURIComponent(request.params.user) : 'all';
    reply('list: ' + user);
}

function give(request, reply) {
    const from = encodeURIComponent(request.payload.from);
    const to = encodeURIComponent(request.payload.to);
    var max_expiration = compute_max_expiration();
    db.findAllGifts(from, to, max_expiration).then(function(result) {
        if (result.count == 0)
        {
            // No existing gift, we create one
            db.createNewGift(from, to, max_expiration).then(function(insert_res) {
                reply(insert_res.get({plain:true}));
            });
        }
        else { // We return existing gift
            reply('{"Existing gifts":' + JSON.stringify(result.rows[0]) + '}');
        }
    });
}

function claim(request, reply) {
    const from = encodeURIComponent(request.payload.from);
    const to = encodeURIComponent(request.payload.to);
    var max_expiration = compute_max_expiration();
    db.findAllGifts(from, to, max_expiration).then(function(result) {
        if (result.count == 1) // There will never be more than one gift to claim
        {
            reply(JSON.stringify(result.rows[0]));
            db.deleteGifts(from, to, max_expiration);
        }
        else {
            reply(JSON.stringify('{}'));
        }
    });
}
//TODO add catch to handle error
//TODO gatling
//TODO test mochai chai sinon

module.exports.claim = claim;
module.exports.give = give;
module.exports.list = list;
var exports = module.exports;
