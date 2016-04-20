var assert = require('chai').assert;
var Gift = require('../gift').Gift;
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Gift', function () {
    it('should create a new gift if no gift from foo to bar exists', function (done) {
        //setup
        var gift = new Gift('foo', 'bar');
        var giftCreate = Promise.resolve({get:sinon.stub().returns({insertion:'data'})});
        var createNewGiftStub = sinon.stub().returns(giftCreate)
        sinon.stub(gift, 'getDb').returns({
            findAndCountAllGifts: sinon.stub().returns(Promise.resolve({count:0})),
            createNewGift: createNewGiftStub
        });
        var replyCallback = sinon.spy();
        sinon.stub(gift, 'compute_max_expiration').returns(new Date(0));
        //action
        gift.give(function(data){
            //assert

            assert.deepEqual(createNewGiftStub.getCall(0).args, ['foo', 'bar', new Date(0)]);
            assert.deepEqual(data, {"insertion": "data"});
            done();
        });
    });
});
