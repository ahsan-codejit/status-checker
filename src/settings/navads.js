'use strict';
// src/settings/navads
module.exports = class Navads {
	constructor(){
		let dbConfig = {
			host: process.env.CUSTAREA_DB_HOST,
			port: process.env.CUSTAREA_DB_PORT,
			user: process.env.CUSTAREA_DB_USER,
			password: process.env.CUSTAREA_DB_PASSWORD,
			name: process.env.CUSTAREA_DB_NAME,
			dialect: "mysql"
		};
		let idCollectorDBConfig = dbConfig;
		let api = {
			url:process.env.NAVADS_API_URL,
			key:process.env.NAVADS_API_KEY
		};
		let idListQuery = process.env.NAVADS_QUERY;
		
		// DEV AND TEST purpose
		if(['dev', 'test'].includes(process.env.NODE_ENV) && !(dbConfig.host && dbConfig.user && dbConfig.password && dbConfig.name)){
			let dbConfigFile = require('../../configs/db');
			if(dbConfigFile){
				dbConfig = dbConfigFile[process.env.NODE_ENV] || null;
				idCollectorDBConfig = dbConfigFile.prod;
			}
		}
		if(['dev', 'test'].includes(process.env.NODE_ENV) && !(api.url && api.key && idListQuery)){
			let config = require(`../../configs/${process.env.settings || 'config'}`);
			if(typeof config !== 'object' || !config.navads){
				console.log('configuration is required');
				throw new Error('configuration is required');
			}
			if(typeof config.navads.api !== 'object' || !config.navads.api.key || !config.navads.api.key || !config.navads.idListQuery){
				console.log('Please set required configurations.');
				throw new Error('Please set required configurations.');
			}
			api = config.navads.api;
			idListQuery = config.navads.idListQuery;
		}
		// END OF CONFIG FOR DEV AND TEST

		this.configs = {
			dbConfig,
			api,
			idListQuery,
			idCollectorDBConfig
		};
	}
};