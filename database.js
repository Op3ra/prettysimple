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
User.belongsToMany(User, {as: 'id_a', through: 'friends'});
User.belongsToMany(User, {as: 'id_b', through: 'friends'});
User.sync().then(function () {
    console.log('Synced Users table');
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
City.sync().then(function () {
    console.log('Synced City table');
});

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
Gift.sync().then(function () {
    console.log('Synced Gift table');
});

var DBHandle = function() {
};

DBHandle.prototype.Users = function() {
    return User;
}

DBHandle.prototype.Cities = function() {
    return City;
}

DBHandle.prototype.Gifts = function() {
    return Gift;
}

module.exports.DBHandle = DBHandle;
var exports = module.exports;
