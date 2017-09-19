// test/lib.js
const sinon = require('sinon');
require('chai').use(require('sinon-chai'));
const expect = require('chai').expect;

const app = require('../src/app');
const serviceBuilder = require('../src/services/builder');
const services = serviceBuilder.build('navads');

describe('#src', function(){
	describe('src/app.js', function(){
		it('should return an app object', function(done){
			expect(app).to.be.a('object');
			done();
		});

		it(`has run method taking checker name and checker starter`, function(){
			it(`is a function`, function(done){
				expect(app.run).to.be.a('function');
				done();
			});

			it(`throws error if checker name is not set in params`, function(done){
				expect(app.run()).to.throw();
				done();
			});

			it(`throws error if starter is not set in params`, function(done){
				expect(app.run('navads')).to.throw();
				done();
			});

			it(`works successfully with checker name and callback in params`, function(done){
				var cb = sinon.spy();
	        	app.run('navads', cb);
	        	expect(cb).to.have.been.calledWith('navads', services);
			});
		});
		
	});
	describe('src/starter.js', function(){
		const starter = require('../src/starter');
		it(`'s a function`, function(done){
			expect(starter).to.be.a('function');
			done();
		});
	});
});