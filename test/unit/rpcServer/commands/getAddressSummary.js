const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sion = require('sinon');
const getAddressSummaryFactory = require('../../../../lib/rpcServer/commands/getAddressSummary');
const coreAPIFixture = require('../../../mocks/coreAPIFixture');
const RPCError = require('../../../../lib/rpcServer/RPCError');

const { expect } = chai;
chai.use(chaiAsPromised);
let spy;

describe('getAddressSummary', () => {
  describe('#factory', () => {
    it('should return a function', () => {
      const getAddressSummary = getAddressSummaryFactory(coreAPIFixture);
      expect(getAddressSummary).to.be.a('function');
    });
  });

  before(() => {
    spy = sion.spy(coreAPIFixture, 'getAddressSummary');
  });

  beforeEach(() => {
    spy.resetHistory();
  });

  after(() => {
    spy.restore();
  });

  it('Should return an object', async () => {
    const getAddressSummary = getAddressSummaryFactory(coreAPIFixture);
    expect(spy.callCount).to.be.equal(0);
    const summary = await getAddressSummary({ address: 'XsLdVrfJpzt6Fc8RSUFkqYqtxkLjEv484w' });
    expect(summary).to.be.an('object');
    expect(spy.callCount).to.be.equal(1);
  });

  it('Should throw if arguments are not valid', async () => {
    const getAddressSummary = getAddressSummaryFactory(coreAPIFixture);
    expect(spy.callCount).to.be.equal(0);
    await expect(getAddressSummary([])).to.be.rejected;
    expect(spy.callCount).to.be.equal(0);
    await expect(getAddressSummary({})).to.be.rejectedWith('should have required property \'address\'');
    expect(spy.callCount).to.be.equal(0);
    await expect(getAddressSummary({ address: 1 })).to.be.rejectedWith('params.address should be array,string');
    expect(spy.callCount).to.be.equal(0);
  });

  it('should throw RPCError with code -32603', async function it() {
    const message = 'Some error';
    const error = new Error(message);

    coreAPIFixture.getAddressSummary = this.sinon.stub().throws(error);
    const getAddressSummary = getAddressSummaryFactory(coreAPIFixture);

    try {
      await getAddressSummary({ address: 'XsLdVrfJpzt6Fc8RSUFkqYqtxkLjEv484w' });

      expect.fail('should throw RPCError');
    } catch (e) {
      expect(e).to.be.an.instanceOf(RPCError);
      expect(e.code).to.equal(-32603);
      expect(e.message).to.equal(message);
    }
  });

  it('should throw RPCError with code -32602', async function it() {
    const message = 'Some error';
    const error = new Error(message);
    error.statusCode = 400;

    coreAPIFixture.getAddressSummary = this.sinon.stub().throws(error);
    const getAddressSummary = getAddressSummaryFactory(coreAPIFixture);

    try {
      await getAddressSummary({ address: 'XsLdVrfJpzt6Fc8RSUFkqYqtxkLjEv484w' });

      expect.fail('should throw RPCError');
    } catch (e) {
      expect(e).to.be.an.instanceOf(RPCError);
      expect(e.code).to.equal(-32602);
      expect(e.message).to.equal(message);
    }
  });
});
