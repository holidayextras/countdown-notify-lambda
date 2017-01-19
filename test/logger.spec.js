'use strict';

const chai = require('chai');
const sinon = require('sinon');
const logger = require('../src/logger/logger');
const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const expect = chai.expect;

describe('Logger', function() {

  let sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  describe('setting up the streams', function() {
    let streams;

    context('when provided with sumo creds', function() {

      beforeEach(function() {
        process.env.SUMOLOGIC_CODE = 'sumo_code';
        process.env.SUMOLOGIC_URL = 'sumo_url';
        streams = logger._setupStreams();
      });

      afterEach(function() {
        delete process.env.SUMOLOGIC_CODE;
        delete process.env.SUMOLOGIC_URL;
      });

      it('sets up a console logger', function() {
        expect(streams[0].stream).to.equal(process.stdout);
      });

      it('sets up sumologic logger', function() {
        expect(streams[1].type).to.equal('raw');
        expect(streams[1].stream).to.be.instanceof(SumoLogger);
      });

      it('does not setup any other loggers', function() {
        expect(streams.length).to.equal(2);
      });
    });

    context('when not on production', function() {

      beforeEach(function() {
        streams = logger._setupStreams();
      });

      it('sets up a console logger', function() {
        expect(streams[0].stream).to.equal(process.stdout);
      });

      it('does not setup any other loggers', function() {
        expect(streams.length).to.equal(1);
      });
    });
  });

  describe('setting up the logger', function() {
    let fakeStreams;
    beforeEach(function() {
      fakeStreams = ['stream1', 'stream2'];
      sandbox.stub(bunyan, 'createLogger');
      sandbox.stub(logger, '_setupStreams').returns(fakeStreams);
      logger.setupLogging();
    });

    it('can setup logging', function() {
      expect(bunyan.createLogger).to.have.been.calledWith({ name: 'countdown-lambda', streams: fakeStreams } );
    });
  });

});
