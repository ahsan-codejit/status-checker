'use strict';
const request = require('request-promise');
module.exports = class ApiCaller{
	constructor(options){
		if(options) {
			this.options = options;
		}
	}

	execute(options){
		if(options){
			this.options = options;
		}
	 	return request(this.options)
	    .then(function (res, body) {
	    	return res;
	    })
	    .catch(function (err) {
	    	console.log('Exception happened in apicaller: ', JSON.stringify(err));
	    	return null;
	    });
	}
};