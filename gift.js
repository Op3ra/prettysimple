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
    db.Gifts().findAll({
        attributes: ['expiration'],
        where: {
            expiration: {
                $lte: max_expiration
            },
            senderId: self.from,
            receiverId: self.to
        }
    }).then(function(result) {
        if (! result.expiration) { // No existing gift, we create one
            db.Gifts().create({
                expiration: max_expiration,
                senderId: self.from,
                receiverId: self.to
            }).then(function (insert) {
                reply(insert);
            });
        }
        else {
            reply('FIXME');
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
