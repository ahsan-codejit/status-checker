'use strict';
const expect = require('chai').expect;
const Navads = require('../src/settings/navads');
const settingsLoader = require('../src/settings/settingsLoader');

describe.only('#settings', function(){
	describe('#settingsLoader', function(){
		it(`is a function`, function(done){
			expect(settingsLoader).to.be.a('function');
			done();
		});

		it(`takes checker name and loads settings accordingly and returns settings`, function(done){
			let settings = settingsLoader('navads');
			expect(settings).to.be.an('object');
			expect(settings.dbConfig).to.be.an('object');
			expect(settings.idCollectorDBConfig).to.be.an('object');
			expect(settings.api).to.be.an('object');
			done();
		});
	});

	describe('#Navads-settings', function(){
		it(`is a class`, function(done){
			expect(Navads).to.be.a('function');
			done();
		});
		it(`returns contains configs`, function(done){
			let obj = new Navads();
			expect(obj.configs).to.be.an('object');
			expect(obj.configs.dbConfig).to.be.an('object');
			expect(obj.configs.dbConfig.host).to.be.a('string');
			done();
		});
	});
});