'use strict';

const DBHandle = require('./database.js');
var db = new DBHandle.DBHandle();

var Gift = function(from, to) {
    this.from = from;
    this.to = to;
};

Gift.prototype.give = function(reply) {
    var max_expiration = new Date();
    max_expiration.setDate(max_expiration.getDate() + 7);
    var self = this;
    db.Gifts().findAndCountAll({
        attributes: ['expiration'],
        where: {
            expiration: { $and: {
                $lte: max_expiration,
                $gt: new Date()
            }},
            sender_id: self.from,
            receiver_id: self.to
        }
    }).then(function(result) {
        console.log(require('util').inspect(result, { depth: 1 }));
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
            reply('{"Existing gifts":' + JSON.stringify(result.rows) + '}');
        }
    });
}

Gift.prototype.claim = function() {
    console.log(this.from);
    console.log(this.to);
    console.log(this.date);
}

module.exports.Gift = Gift;
var exports = module.exports;
