'use strict';

const chai = require('chai');
const sinon = require('sinon');
var dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
chai.use(dirtyChai);
chai.use(sinonChai);
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

    let callerCallback;

    beforeEach(function() {
      callerCallback = sandbox.stub();
      sandbox.stub(Certs, 'downloadCerts');
      sandbox.stub(pushService, 'findEvents');
    });

    context('when there are no errors', function() {

      beforeEach(function() {
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
        pushService.run(callerCallback);
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

      it('runs provided callback with a success response', function() {
        expect(callerCallback).to.have.been.calledWith(null, 'OK');
      });

    });

    context('with an error', function() {

      beforeEach(function() {
        pushService.findEvents.yields('FAKE_ERROR');
        pushService.run(callerCallback);
      });

      it('runs provided callback with an error response', function() {
        expect(callerCallback).to.have.been.calledWith('FAKE_ERROR');
      });

    });

  });

  describe('sendPushNotification()', function() {

    let callerCallback;

    beforeEach(function() {
      callerCallback = sandbox.stub();
      sandbox.stub(PushNotifications.prototype, 'send');
      PushNotifications.prototype.send.yields({});
      pushService.sendPushNotification({
        Device: {},
        Scenario: {}
      }, callerCallback);
    });

    it('sends a push notification', function() {
      expect(PushNotifications.prototype.send).to.have.been.called();
    });

    it('run the provided callback', function() {
      expect(callerCallback).to.have.been.called();
    });

  });

});
