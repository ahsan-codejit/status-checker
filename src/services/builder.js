'use strict';

const Sequelize = require('sequelize');
const DBConnector = require('./dbConnector');
const IdListCollector = require('./idListCollector');
const APICaller = require('./apiCaller');
const emitterBuilder = require('./emitter');
const settingsLoader = require('../settings/settingsLoader');

module.exports = {
	build : function(checkerName){
		if(typeof checkerName !== 'string'){
			throw new Error('Checker name is requiered.');
		}
		
		let settings = settingsLoader(checkerName);
		const dbConnection = this.getDBConnection(settings.dbConfig);
		const idCollectorDBConn = this.getDBConnection(settings.idCollectorDBConfig);
		const idListCollector = this.getIdListCollector(idCollectorDBConn, settings);
		const dbDataTypes = Sequelize;
		const apiCaller = this.getAPICaller();
		const emitter = this.emitter(checkerName);

		return {
			dbConnection,
			dbDataTypes,
			settings,
			idListCollector,
			apiCaller,
			emitter
		};
	},
	getDBConnection : function(dbConfig){
		const dbConnector = new DBConnector(dbConfig);
		return dbConnector.dbConnection;
	},
	getIdListCollector : function(dbConnection, settings){
		return new IdListCollector(dbConnection, settings.idListQuery);
	},
	getAPICaller : function(options){
		return new APICaller(options);
	},
	getSettings : function(checkerName){
		return settingsLoader(checkerName);
	},
	emitter: emitterBuilder
};