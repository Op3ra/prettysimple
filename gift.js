'use strict';

const DBHandle = require('./database');
var db = new DBHandle.DBHandle();

function compute_max_expiration() {
    var max_expiration = new Date();
    max_expiration.setDate(max_expiration.getDate() + 7);
    return max_expiration;
}

function newGiftAllowed(result) {
    if (result.count == 0) return true;

    var latestGift = result.rows[0].get('send_date');
    var curDate = new Date();
    // We only compare date so we set time to 00:00:00.000
    latestGift.setHours(0,0,0,0);
    curDate.setHours(0,0,0,0);
    return curDate > latestGift;
}

function list_users(reply) {
    db.listAllUsers().then(function(result) {
        reply(JSON.stringify(result));
    }).catch(function(err) {
        reply(JSON.stringify(err.message));
        console.error(err);
    });
}

function list_all(reply) {
    db.listAllGifts().then(function(result) {
        reply(JSON.stringify(result));
    }).catch(function(err) {
        reply(JSON.stringify(err.message));
        console.error(err);
    });
}

function list_from(user, reply) {
    db.listAllGiftsFrom(user).then(function(result) {
        reply(JSON.stringify(result));
    }).catch(function(err) {
        reply(JSON.stringify(err.message));
        console.error(err);
    });
}

function list_to(user, reply) {
    db.listAllGiftsTo(user).then(function(result) {
        reply(JSON.stringify(result));
    }).catch(function(err) {
        reply(JSON.stringify(err.message));
        console.error(err);
    });
}

function give(from, to, reply) {
    if (from == to) {
        reply(JSON.stringify('User can\'t give a gift to him/herself.'));
        return false;
    }
    var max_expiration = compute_max_expiration();
    db.findAllGifts(from, to, max_expiration).then(function(result) {
        if (newGiftAllowed(result)) {
            // Create new gift and return it
            db.createNewGift(from, to, max_expiration).then(function(insert_res) {
                reply(insert_res.get({plain:true}));
            }).catch(function (err) {
                console.error(err);
                reply(JSON.stringify(err.message));
            });
        }
        else { // We return existing gifts
            reply('{"Existing gifts":' + JSON.stringify(result.rows) + '}');
        }
    }).catch(function(err) {
        console.error(err);
        reply(JSON.stringify(err.message));
    });
}

function claim(from, to, reply) {
    var max_expiration = compute_max_expiration();
    db.findUnclaimedGifts(from, to, max_expiration).then(function(result) {
        if (result.count > 0) {
            // If we find several unclaimed gifts, we claim the oldest one
            db.claimGift(result.rows[0].get('id')).then(function (up_res) {
                reply(JSON.stringify(result.rows[0].get({plain: true})));
            }).catch(function (err){
                console.error(err);
                reply(JSON.stringify(err));
            });
        }
        else {
            reply(JSON.stringify('No gift to claim.'));
        }
    }).catch(function(err) {
        console.error(err);
        reply(JSON.stringify(err.message));
    });
}

module.exports.claim = claim;
module.exports.give = give;
module.exports.list_all = list_all;
module.exports.list_from = list_from;
module.exports.list_to = list_to;
module.exports.list_users = list_users;
var exports = module.exports;
