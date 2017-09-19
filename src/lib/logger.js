const debug = require('debug');

module.exports = function(moduleName){
	let error = debug(`${moduleName}`);
	let log = debug(`${moduleName}`);
	log.log = console.log.bind(console);
	return {
		log: log,
		error: error
	}
}