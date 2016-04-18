'use strict';

const DBHandle = require('./database.js');
var db = new DBHandle.DBHandle();

function compute_max_expiration()
{
    var max_expiration = new Date();
    max_expiration.setDate(max_expiration.getDate() + 7);
    return max_expiration;
}

var Gift = function(from, to) {
    this.from = from;
    this.to = to;
};

Gift.prototype.give = function(reply) {
    var max_expiration = compute_max_expiration();
    var self = this;
    db.Gifts().findAndCountAll({
        attributes: ['id', 'expiration'],
        where: {
            expiration: { $and: {
                $lte: max_expiration,
                $gt: new Date()
            }},
            sender_id: self.from,
            receiver_id: self.to
        }
    }).then(function(result) {
        if (result.count == 0)
        {
            // No existing gift, we create one
            db.Gifts().create({
                expiration: max_expiration,
                sender_id: self.from,
                receiver_id: self.to
            }).then(function(insert_res) {
                reply(insert_res.get({plain:true}));
            });
        }
        else { // We return existing gift
            reply('{"Existing gifts":' + JSON.stringify(result.rows[0]) + '}');
        }
    });
}

Gift.prototype.claim = function(reply) {
    var max_expiration = compute_max_expiration();
    var self = this;
    db.Gifts().findAndCountAll({
        attributes: ['id', 'expiration'],
        where: {
            expiration: { $and: {
                $lte: max_expiration,
                $gt: new Date()
            }},
            sender_id: self.from,
            receiver_id: self.to
        }
    }).then(function(result) {
        if (result.count == 1) // There will never be more than one gift to claim
        {
            reply(JSON.stringify(result.rows[0]));
            db.Gifts().destroy({ // Delete gift
                where: {
                    expiration: { $and: {
                        $lt: max_expiration
                    }},
                    sender_id: self.from,
                    receiver_id: self.to
                }
            });
        }
        else {
            reply('{}');
        }
    });
}

module.exports.Gift = Gift;
var exports = module.exports;
