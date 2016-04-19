'use strict';

var Sequelize = require('sequelize');
const dbstring = 'postgres://pretty:simple@localhost/pretty';
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
    }
},{
        createdAt: false,
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

DBHandle.prototype.findAllGifts = function (from, to, max_expiration) {
    return Gift.findAndCountAll({
        attributes: ['id', 'expiration'],
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

DBHandle.prototype.deleteGifts = function(from, to, max_expiration) {
    return Gift.destroy({
        where: {
            expiration: { $and: {
                $lt: max_expiration
            }},
            sender_id: from,
            receiver_id: to
        }
    });
}

module.exports.DBHandle = DBHandle;
var exports = module.exports;

//TODO : transferer requete
