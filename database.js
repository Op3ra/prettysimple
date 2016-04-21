'use strict';

const Sequelize = require('sequelize');
const dbstring = 'postgres://pretty:simple@localhost/pretty';
const uuid = require('node-uuid');
const Promise = require('bluebird');

var sequelize = new Sequelize(dbstring);

var User = sequelize.define('user', {
    id: {
        field: 'id',
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        field: 'name',
        type: Sequelize.STRING
    }
},{
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
});

var City = sequelize.define('city', {
    id: {
        field: 'id',
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        field: 'name',
        type: Sequelize.STRING
    }
},{
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
});
City.belongsTo(User, {as: 'mayor', foreignKey: 'mayor_id'});

var Gift = sequelize.define('gift', {
    id: {
        field: 'id',
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    expiration: {
        field: 'expiration',
        type: Sequelize.DATE
    },
    claim_date: {
        field: 'claim_date',
        type: Sequelize.DATE
    }
},{
        createdAt: 'send_date', // use default ORM feature for insertion date
        updatedAt: false,
        freezeTableName: true
});
Gift.belongsTo(User, {as: 'sender', foreignKey: 'sender_id'});
Gift.belongsTo(User, {as: 'receiver', foreignKey: 'receiver_id'});

sequelize.sync().then(function(){
    console.log('Sync\'ed database.')
});

var DBHandle = function() {
};

DBHandle.prototype.findUnclaimedGifts = function (from, to, max_expiration) {
    return Gift.findAndCountAll({
        attributes: ['id', 'send_date', 'expiration', 'claim_date'],
        order: 'send_date ASC', // Oldest gift first so we can work directly on index 0 of result
        where: {
            expiration: { $and: {
                $lte: max_expiration,
                $gt: new Date()
            }},
            sender_id: from,
            receiver_id: to,
            claim_date: null
        }
    });
}

DBHandle.prototype.findAllGifts = function (from, to, max_expiration) {
    return Gift.findAndCountAll({
        attributes: ['id', 'send_date', 'expiration', 'claim_date'],
        order: 'send_date DESC', // Latest gift first so we can work directly on index 0 of result
        where: {
            expiration: { $and: {
                $lte: max_expiration,
                $gt: new Date()
            }},
            sender_id: from,
            receiver_id: to
        }
    });
}

DBHandle.prototype.createNewGift = function (from, to, expiration) {
    return Gift.create({
        expiration: expiration,
        sender_id: from,
        receiver_id: to
    });
}

DBHandle.prototype.claimGift = function(giftId) {
    return Gift.update({
        claim_date: new Date()
    },{
        fields: ['claim_date'],
        where: { id: giftId }
    });
}

DBHandle.prototype.listAllGifts = function() {
    return Gift.findAll({
        attributes: ['id', 'sender_id', 'receiver_id', 'expiration', 'claim_date']
    });
}

DBHandle.prototype.listAllGiftsFrom = function(sender) {
    return Gift.findAll({
        attributes: ['id', 'sender_id', 'receiver_id', 'expiration', 'claim_date'],
        where: { sender_id: sender }
    });
}

DBHandle.prototype.listAllGiftsTo = function(receiver) {
    return Gift.findAll({
        attributes: ['id', 'sender_id', 'receiver_id', 'expiration', 'claim_date'],
        where: { receiver_id: receiver }
    });
}

DBHandle.prototype.listAllUsers = function() {
    return User.findAll({
        attributes: ['id', 'name']
    });
}

DBHandle.prototype.createUser = function(username) {
    return User.create({
        id: uuid.v4(),
        name: username
    });
}

DBHandle.prototype.createCity = function(city_name, user_id) {
    return City.create({
        id: uuid.v4(),
        name: city_name,
        mayor_id: user_id
    });
}

module.exports.DBHandle = DBHandle;
var exports = module.exports;
