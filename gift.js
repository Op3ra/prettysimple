'use strict';

const assert = require('assert');

var Gift = function(from, to) {
        assert(from);
        assert(to);
        this.from = from;
        this.to = to;
        this.date = new Date(); 
};

Gift.prototype.give = function() {
        console.log(this.from);
        console.log(this.to);
        console.log(this.date);
}

module.exports.Gift = Gift;
var exports = module.exports;

