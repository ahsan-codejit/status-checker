'use strict';
module.exports = function(cName){
	try{
		let checkerName = cName || 'navads';
		let ConfigClass = require(`./${checkerName}`);
		let configObj = new ConfigClass();
		return configObj.configs;
	} catch(err){
		console.log(`Exception occured in settings loader %o`, err);
	}
		
};