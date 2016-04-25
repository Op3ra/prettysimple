var assert = require('chai').assert;
var DBHandle = require('../database');
var sinon = require('sinon');
var Promise = require('bluebird');

// Mocking creation
var giftCreate = Promise.resolve({get:sinon.stub().returns({insertion:'data'})});
var createNewGiftStub = sinon.stub().returns(giftCreate);

// Mocking gift lookup
var fakeExistingGift = {};
fakeExistingGift.count = 1;
fakeExistingGift.rows = { 0: { get:sinon.stub().returns(new Date()) }};

var findAllGiftsStub = sinon.stub();
findAllGiftsStub.onCall(0).returns(Promise.resolve({count:0}));
findAllGiftsStub.onCall(1).returns(Promise.resolve(fakeExistingGift));

var dbStub = sinon.stub(DBHandle, 'DBHandle').returns({
    findAllGifts: findAllGiftsStub,
    createNewGift: createNewGiftStub
});

var Gift = require('../gift');

describe('Gift', function () {
    var clock = sinon.useFakeTimers();

    it('Sending no existing', function (done) {
        Gift.give('foo', 'bar', function(data) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(data, {'insertion': 'data'});
            done();
        });
    });

    it('Sending with existing', function (done) {
        Gift.give('foo', 'bar', function(data) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(data, '{"Existing gifts":{"0":{}}}');
            done();
        });
    });


});
