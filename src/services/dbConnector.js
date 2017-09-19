'use strict';
const Sequelize = require('sequelize');
module.exports = class DBConnector{
	constructor(dbConfig){
		if(!dbConfig){
			throw new Error('Database configuration is required');
		}
		if(!dbConfig.name || !dbConfig.user || !dbConfig.password){
			throw new Error('Database name, username and password are required');
		}
		
		this.dbConnection = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
			host: dbConfig.host || 'localhost',
			dialect: dbConfig.dialect || 'mysql',
			pool: {
				min: 0,
				max: 4,
			    idle: 120000
			}
		});
	}

	getConnection(){
		return this.dbConnection;
	}
};