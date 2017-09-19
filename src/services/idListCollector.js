'use strict';
module.exports = class IdListCollector {
	constructor(dbConnection, query=null){
		this.dbConnection = dbConnection;
		if(query) {
			this.idListQuery = query;
		}
	}

	setQuery(query){
		this.idListQuery = query;
	}
	
	getList(query){
		let idListQuery = query || this.idListQuery || null;
		if(!idListQuery) {
			throw new Error('Id list query is required.');
		}
		return this.dbConnection.query(this.idListQuery, { type: this.dbConnection.QueryTypes.SELECT});
	}
};