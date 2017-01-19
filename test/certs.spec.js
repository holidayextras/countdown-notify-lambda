'use strict';

const chai = require('chai');
const sinon = require('sinon');
var dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
chai.use(dirtyChai);
chai.use(sinonChai);
const expect = chai.expect;

const Certs = require('../src/certs');

describe('Certs', function() {

  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('downloadCerts()', function() {

    beforeEach(function() {
      sandbox.stub(Certs, '_get');
      Certs.downloadCerts();
    });

    it('downloads the certificate', function() {
      expect(Certs._get.firstCall).to.have.been.calledWith('aps.pem');
    });

    it('downloads the private key', function() {
      expect(Certs._get.secondCall).to.have.been.calledWith('push_services_key.pem');
    });

  });

  describe('_get()', function() {

    let pipeStub;

    beforeEach(function() {
      sandbox.stub(Certs, '_createDirectory');
      pipeStub = sandbox.stub();
      sandbox.stub(Certs, '_getRemoteStream');
      Certs._getRemoteStream.returns({
        pipe: pipeStub
      });
      sandbox.stub(Certs, '_getLocalStream');
      Certs._get('FAKE_FILE');
    });

    it('creates a local directory', function() {
      expect(Certs._createDirectory).to.have.been.called();
    });

    it('gets a remote stream from S3', function() {
      expect(Certs._getRemoteStream).to.have.been.calledWith('FAKE_FILE');
    });

    it('gets a local stream for saving the file', function() {
      expect(Certs._getLocalStream).to.have.been.calledWith('FAKE_FILE');
    });

    it('sends the data from S3 to the local file', function() {
      expect(pipeStub).to.have.been.called();
    });

  });

});
