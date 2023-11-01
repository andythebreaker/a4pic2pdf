const chai = require('chai');
const expect = chai.expect;
const findUnusedPort = require('./index.js'); // Replace 'your-module' with the actual path to your module

describe('findUnusedPort', function () {
    it('should return an unused port', function (done) {
        findUnusedPort(39487, 50000, (err, port) => {
            expect(err).to.be.null;
            expect(port).to.be.a('number');
            expect(port).to.be.within(39487, 50000);
            done();
        });
    });

    it('should return an error if all ports in the range are in use', function (done) {
        // Replace this test case with a specific scenario that generates an error
        findUnusedPort(39487, 39488, (err, port) => {
            expect(err).to.exist;
            expect(port).to.be.undefined;
            done();
        });
    });
});
