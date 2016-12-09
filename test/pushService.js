'use strict';

const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

const pushService = require('../src/pushService');
const Certs = require('../src/certs');
const scenarios = require('../src/scenarios');
const PushNotifications = require('node-pushnotifications');

describe('pushService', function() {

  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('run()', function() {

    let service;

    beforeEach(function() {
      sandbox.stub(Certs, 'downloadCerts');
      sandbox.stub(pushService, 'findEvents');
    });

    context('when there are no errors', function() {

      beforeEach(function(done) {
        pushService.findEvents.yields(null, [{
          Event: {},
          Scenario: {}
        }]);
        sandbox.stub(pushService, 'addDeviceToResult');
        pushService.addDeviceToResult.yields(null, {
          Event: {},
          Scenario: {},
          Device: {
            PushID: 'FAKE_PUSH_ID'
          }
        });
        sandbox.stub(pushService, 'canPush');
        pushService.canPush.returns(true);
        sandbox.stub(pushService, 'sendPushNotification');
        pushService.sendPushNotification.yields();
        service = pushService.run().then(done);
      });

      it('downloads required certificates', function() {
        expect(Certs.downloadCerts).to.have.been.called();
      });

      it('finds events for every scenario', function() {
        expect(pushService.findEvents).to.have.callCount(scenarios.length);
      });

      it('adds devices to found events', function() {
        expect(pushService.addDeviceToResult).to.have.callCount(scenarios.length);
      });

      it('checks if events are pushable', function() {
        expect(pushService.canPush).to.have.callCount(scenarios.length);
      });

      it('sends push notifications for devices with push IDs', function() {
        expect(pushService.sendPushNotification).to.have.callCount(scenarios.length);
      });

      it('fulfills the promise', function() {
        expect(service).to.be.fulfilled();
      });

    });

    context('with an error', function() {

      beforeEach(function() {
        pushService.findEvents.yields('FAKE_ERROR');
        pushService.run();
      });

      it('rejects the promise', function() {
        expect(service).to.eventually.be.rejectedWith('FAKE_ERROR');
      });

    });

  });

  describe('_generatePushData()', function() {

    let result;

    beforeEach(function() {
      const push = {
        Device: {
          Platform: 'BlackBerry'
        },
        Scenario: {
          BlackBerry: {
            titleTemplate: 'the title for %s',
            messageTemplate: 'the message for %s'
          }
        },
        Event: {
          Destination: 'Skatepark',
          ID: 123
        }
      };
      result = pushService._generatePushData(push);
    });

    it('returns an object', function() {
      expect(result).to.be.an('Object');
    });

    it('returns the event ID', function() {
      expect(result.custom.eventId).to.equal(123);
    });

    it('includes the destination in the title', function() {
      expect(result.title).to.equal('the title for Skatepark');
    });

    it('includes the destination in the message', function() {
      expect(result.message).to.equal('the message for Skatepark');
    });

  });

  describe('sendPushNotification()', function() {

    let callerCallback;

    beforeEach(function() {
      callerCallback = sandbox.stub();
      sandbox.stub(PushNotifications.prototype, 'send');
      PushNotifications.prototype.send.yields({});
      pushService.sendPushNotification({
        Device: {
          Platform: 'BlackBerry'
        },
        Scenario: {
          BlackBerry: {
            titleTemplate: 'the title for %s',
            messageTemplate: 'the message for %s'
          }
        },
        Event: {
          Destination: 'Skatepark'
        }
      }, callerCallback);
    });

    it('sends a push notification', function() {
      expect(PushNotifications.prototype.send).to.have.been.called();
    });

    it('runs the provided callback', function() {
      expect(callerCallback).to.have.been.called();
    });

  });

});
