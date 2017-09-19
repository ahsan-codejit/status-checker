const StatusChecker = require('./checkers/statusChecker');
module.exports = function(checkerName, params){
	let statusCheckerObj = new StatusChecker(checkerName, params);
	statusCheckerObj.start();
};