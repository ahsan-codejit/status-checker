'use strict';
// controllers/statusChecker.js
module.exports = class StatusChecker {
	constructor(checkerName, services){
		if(typeof checkerName !== 'string'){
			throw new Error('Checker name is required');
		}
		const Checker = require(`./${checkerName}`);
		if(typeof Checker !== 'function'){
			throw new Error(`${checkerName} checker is not defined`);
		}
		this.checker = new Checker(services);
	}

	start(connector, dataTypes){
		this.checker.start();
	}
};

