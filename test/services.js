'use strict';
require('chai').use(require('sinon-chai'));
const expect = require('chai').expect;

const app = require('../src/app');
const serviceBuilder = require('../src/services/builder');
const services = serviceBuilder.build('navads');
const IdListCollector = require('../src/services/idListCollector');
const DBConnector = require('../src/services/dbConnector');
const emitter = require('../src/services/emitter');

let dbConfig = require('../configs/db');

describe('#services', function(){
	describe('#builder', function(){
		it(`is an object`, function(done){
			expect(serviceBuilder).to.be.an('object');
			done();
		});
		it(`has mathod called build to build necessary searvices for the checker based on config`, function(){
			it('build is a function', function(done){
				expect(serviceBuilder.build).to.be.a('function');
				done();
			});
			it('build retuns object containing necessary services', function(done){
				let services = serviceBuilder.build('navads');
				expect(services).expect.to.be.a('object');
				expect(services).to.include('dbConnection');
				expect(services).to.include('dbDataTypes');
				expect(services).to.include('settings');
				expect(services).to.include('idListCollector');
				done();
			});
		});

		it(`has getDBConnection method`, function(done){
			expect(serviceBuilder.getDBConnection).to.be.a('function');
			done();
		});
	});
	describe('#idListCollector', function(){
		services.idListCollector.setQuery(services.settings.idListQuery);
		it('is a class', function(done){
			expect(IdListCollector).to.be.a('function');
			done();
		});

		it(`getList will return promise of id list`, function(done){
			this.timeout(3000);
			
			// let idListCollector = new IdListCollector(services.dbConnection, services.config.idListQuery);
			services.idListCollector
			.getList()
			.then(res=>{
				expect(res).to.be.an('array');
				// res.forEach(v=>{
				// 	console.log(v.id);
				// });
				done();
			})
			.catch(err=>{
				console.log('idListCollector test: ', err);
				done();
			});
		});
	});

	describe('#dbConnector', function(){
		it(`is a class`, function(done){
			let dbConnector = new DBConnector(dbConfig.prod);
			expect(DBConnector).to.be.a('function');
			expect(dbConnector instanceof DBConnector).to.be.true;
			done();
		});

		it(`should create a valid connection`, function(done){
			let dbConnector = new DBConnector(dbConfig.test);
			expect(dbConnector.dbConnection.authenticate).to.be.a('function');
			if(dbConnector.dbConnection.authenticate()){
				dbConnector.dbConnection.authenticate()
				.then(() => {
					console.log('Connection has been established successfully.');
					done();
				})
				.catch(err => {
					console.error('Unable to connect to the database:', err);
					expect(err).to.be.equal(null);
					done();
				});
			} else {
				done();
			}
		});
	});
	describe('#emitter', function(){
		it(`is a function`, function(done){
			expect(emitter).to.be.a('function');
			done();
		});

		it(`throws error if wrong emmiter name is passed`, function(done){
			let emittercall = () => { emitter({});};
			expect(emittercall).to.throw();
			done();
		});

		it(`takes emmiter name and return emmiter obj`, function(done){
			let navadsEmitter = emitter('navads');
			navadsEmitter.on('event', function(){
				done();
			});
			navadsEmitter.emit('event');
		});
	});
});