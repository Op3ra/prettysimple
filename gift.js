'use strict';

var Gift = function(from, to, db_handle) {
    this.from = from;
    this.to = to;
    this.dbh = db_handle;
    this.date = Date.now(); 
};

Gift.prototype.give = function(reply) {
    var query_txt = 'SELECT expiration FROM gifts WHERE id_from = \'' + this.from + '\' AND id_to = \'' + this.to + '\'';
    console.log(query_txt);
    this.dbh.query(query_txt, function(err, result) {
        if (err)
        {
            console.log(err);
            reply('An error occured while sending gift: ' + err);
        }
        console.log(result);
        if (result.rowCount == 0) // No waiting gift. Proceed.
        {
            reply('New gift sent. It will expire on ' + this.date);
        }
        else
        {
            reply('There is already a pending gift. It will expire on ' + this.date);
        }
    });
}

Gift.prototype.claim = function() {
    console.log(this.from);
    console.log(this.to);
    console.log(this.date);
}

Gift.prototype.get_date = function() {
    return this.date;
}

module.exports.Gift = Gift;
var exports = module.exports;

