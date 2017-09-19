'use strict';
const console = require('./lib/logger')('checker:app');
const servicesBuilder = require('./services/builder');
module.exports = {
	run: function(checkerName, fn){
		if(typeof checkerName !== 'string'){
			throw new Error('Checker name is requiered.');
		}

		if(typeof fn !=='function'){
			throw new Error('run requires callback function');
		}
		let services = servicesBuilder.build(checkerName);
		fn(checkerName, services);

		services.emitter.on('done', function(idListToCheck, failedIdList){
			console.log(`Total Ids to process: ${idListToCheck.length}`);
			console.log(`Total failed Ids to process: ${failedIdList.length}`);
			console.log(`Failed Ids: ${failedIdList.join()}`);
			if(services.dbConnection){
				services.dbConnection.close();
			}
			if(services.idListCollector){
				services.idListCollector.dbConnection.close();
			}
			process.exit();
		});

		services.emitter.on('fail', function(msg){
			console.error(`${checkerName} checking process fails: ${msg}`);
			if(services.dbConnection){
				services.dbConnection.close();
			}
			if(services.idListCollector){
				services.idListCollector.dbConnection.close();
			}
			process.exit();
		});

		services.emitter.on('exception', function(err){
			console.error(`Exception occured: %o`, err);
			if(services.dbConnection){
				services.dbConnection.close();
			}
			if(services.idListCollector){
				services.idListCollector.dbConnection.close();
			}
			process.exit();
		});

		process.on('exit', (code) => {
		  console.log(`About to exit with code: ${code}`);
		});
	}
};