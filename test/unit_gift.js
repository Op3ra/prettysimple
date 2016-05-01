var assert = require('chai').assert;
var DBHandle = require('../database');
var sinon = require('sinon');
var Promise = require('bluebird');

// Setup DB stub
var createNewGiftStub = sinon.stub();
var findAllGiftsStub = sinon.stub();
var findUnclaimedGiftsStub = sinon.stub();
var claimGiftStub = sinon.stub();
var dbStub = sinon.stub(DBHandle, 'DBHandle').returns({
    findAllGifts: findAllGiftsStub,
    createNewGift: createNewGiftStub,
    findUnclaimedGifts: findUnclaimedGiftsStub,
    claimGift: claimGiftStub
});

var Gift = require('../gift');


describe('Gift.give()', function () {
    var clock = sinon.useFakeTimers(Date.now());

    it('Can\'t send to self', function (done) {
        Gift.give('foo', 'foo', function(error) {
            assert.equal(error, 'User can\'t give a gift to him/herself.');
            done();
        });
    });

    it('First gift', function (done) {
        var fakeInsertResult = {
            insertion: 'data'
        };
        createNewGiftStub.returns(Promise.resolve({get:sinon.stub().returns(fakeInsertResult)}));
        findAllGiftsStub.returns(Promise.resolve({count:0}));

        Gift.give('foo', 'bar', function(insert_return) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(insert_return, fakeInsertResult);
            done();
        });
    });

    it('With existing', function (done) {
        var fakeExistingGift = {
            count: 1,
            rows: { 0: { get:sinon.stub().returns(new Date()), data:'data' } }
        };

        findAllGiftsStub.returns(Promise.resolve(fakeExistingGift));

        Gift.give('foo', 'bar', function(insert_return) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(insert_return, '{"Existing gifts":' + JSON.stringify(fakeExistingGift.rows) + '}');
            done();
        });
    });

    it('The next day', function (done) {
        var fakeInsertResult = {
            insertion: 'data'
        };
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var fakeExistingGift = {
            count: 1,
            rows: { 0: { get:sinon.stub().returns(yesterday) } }
        };

        findAllGiftsStub.returns(Promise.resolve(fakeExistingGift));
        createNewGiftStub.returns(Promise.resolve({get:sinon.stub().returns(fakeInsertResult)}));

        Gift.give('foo', 'bar', function(insert_return) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(findAllGiftsStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(insert_return, fakeInsertResult);
            done();
        });
    });

    it('DB throws on gift list', function (done) {
        var errorList = new Error('DB error message list');
        findAllGiftsStub.returns(Promise.reject(errorList));

        Gift.give('foo', 'bar', function(errThrown) {
            assert.deepEqual(errThrown, errorList.message);
            done();
        });
    });

    it('DB throws on gift creation', function (done) {
        var errorCreation = new Error('DB error message creation');
        createNewGiftStub.returns(Promise.reject(errorCreation));
        findAllGiftsStub.returns(Promise.resolve({count:0}));

        Gift.give('foo', 'bar', function(errThrown) {
            assert.deepEqual(errThrown, errorCreation.message);
            done();
        });
    });
});


describe('Gift.claim()', function () {
    var clock = sinon.useFakeTimers(Date.now());

    it('No gift to claim', function (done) {
        findUnclaimedGiftsStub.returns(Promise.resolve({count:0}));
        Gift.claim('foo', 'bar', function(errorNo) {
            assert.equal(errorNo, 'No gift to claim.');
            done();
        });
    });

    it('Claim gift', function (done) {
        var fakeExistingGift = {
            count: 2,
            rows: {
                0: { get:sinon.stub().returns('GiftId0') },
                1: { get:sinon.stub().returns('GiftId1') }
            }
        };
        findUnclaimedGiftsStub.returns(Promise.resolve(fakeExistingGift));
        claimGiftStub.returns(Promise.resolve('update_res'));

        Gift.claim('foo', 'bar', function(claim_return) {
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            assert.deepEqual(findUnclaimedGiftsStub.getCall(0).args, ['foo', 'bar', expiration]);
            assert.deepEqual(claimGiftStub.getCall(0).args, ['GiftId0']);
            assert.deepEqual(claim_return, JSON.stringify('GiftId0'));
            done();
        });
    });

  it('DB throws on gift list', function (done) {
        var errorList = new Error('DB error message list');
        findUnclaimedGiftsStub.returns(Promise.reject(errorList));

        Gift.claim('foo', 'bar', function(errThrown) {
            assert.deepEqual(errThrown, errorList.message);
            done();
        });
    });

    it('DB throws on gift claiming', function (done) {
        var fakeExistingGift = {
            count: 1,
            rows: { 0: { get:sinon.stub().returns('GiftId') } }
        };
        findUnclaimedGiftsStub.returns(Promise.resolve(fakeExistingGift));

        var errorClaim = new Error('DB error message claim');
        claimGiftStub.returns(Promise.reject(errorClaim));

        Gift.claim('foo', 'bar', function(errThrown) {
            assert.deepEqual(errThrown, errorClaim.message);
            done();
        });
    });

});

