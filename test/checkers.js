// test/checkers.js
const expect = require('chai').expect;

const app = require('../src/app');
const serviceBuilder = require('../src/services/builder');
const services = serviceBuilder.build('navads');
const StatusChecker = require('../src/checkers/statusChecker');
const Navads = require('../src/checkers/navads');
const navadsObj = new Navads(services);
let statusDetails = require('./data/statusDetails');
let navadsId = 'NVDS265-377231';

describe('#checkers', function(){
	this.timeout(4000);
	describe('#StatusChecker', function(){
		let statusChecker = new StatusChecker('navads', services);

		it(`'s a class`, function(done){
			expect(StatusChecker).to.be.a('function');
			done();
		});

		it('should throw error at initiating without checker name', function(done){
			let initiate = () => new StatusChecker();
			expect(initiate).to.throw(Error);
			done();
		});

		it('should throw error for a not existed checker name', function(done){
			let initiate = () => new StatusChecker('test');
			expect(initiate).to.throw(Error);
			done();
		});

		it('should not throw error', function(done){
			let initiate = () => new StatusChecker('navads', services);
			expect(initiate).to.not.throw(Error);
			done();
		});

		it('should initiate object correctly', function(done){
			expect(statusChecker instanceof StatusChecker).to.be.true;
			done();
		});

		it('should initiate a checker object', function(done){
			expect(statusChecker.checker instanceof Navads).to.be.true;
			done();
		});

		it('should contain start method', function(done){
			expect(statusChecker.start).to.be.a('function');
			done();
		});
	});

	describe('#Navads', function(){
	
		it('is a class', function(done){
			expect(Navads).to.be.a('function');
			expect(navadsObj instanceof Navads).to.be.true;
			done();
		});

		it(`'s saveSubmissionStatus method takes an object of status info and store`, function(done){
			navadsObj.saveSubmissionStatus(statusDetails);
			navadsObj.SubmissionStatus
			.findById(navadsId)
			.then(submissionStatus=>{
				expect(submissionStatus.navadsId).to.be.equal(navadsId);
				done();
			})
			.catch((err)=>{
				done();
			});
		});

		it(`'s deleteSubmissionStatuse delets status by navads id`, function(done){
			navadsObj.deleteSubmissionStatuse(navadsId)
			.then(status=>{
				expect(typeof status).to.be.equal('boolean');
				done();
			})
			.catch((err)=>{
				done();
			});
		});

		it(`'s saveChannelStatus method takes an object of status info and store`, function(done){
			navadsObj.saveChannelStatus(statusDetails);
			navadsObj.ChannelStatus
			.findById(navadsId)
			.then(submissionStatus=>{
				expect(submissionStatus.navadsId).to.be.equal(navadsId);
				done();
			})
			.catch((err)=>{
				done();
			});
		});

		it(`'s deleteChannelStatuse delets statuses by navads id`, function(done){
			navadsObj.deleteChannelStatuse(navadsId)
			.then(status=>{
				expect(typeof status).to.be.equal('boolean');
			});
			setTimeout(done, 3000);
		});

		it(`has idListCollector to to fetch ids`, function(done){
			navadsObj.idListCollector
			.getList()
			.then(res => {
				expect(res).to.be.an('array');
			});
			setTimeout(done, 3000);
		});

		it(`process should work successfully`, function(done){
			
			['NVDS265-367540', 'NVDS265-367547', 'NVDS265-367551']
			.forEach(id=>{
				navadsObj.check('NVDS265-367214')
				.then(res=>{
					expect(res).to.be.equal(true);
				});
			});
			setTimeout(done, 3000);
		});
		
		it(`'s getStatusDetails returns promise of details of NVDS265-367868 from vavads`, function(done){
			navadsObj.getStatusDetails('NVDS265-367214')
			.then(details=>{
				navadsObj.saveSubmissionStatus(details);
				navadsObj.saveChannelStatus(details);
				done();
			});
		});
	});
});