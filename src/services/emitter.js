'use strict';
const EventEmitter = require('events');
class NavadsEmitter extends EventEmitter {}
module.exports = (emitterName) => {
	if(emitterName && typeof emitterName!=='string'){
		throw new Error(`Valid emmiter name is required`);
	}
	let emmiter;
	switch(emitterName){
		case 'navads':
			emmiter = new NavadsEmitter();
			break;
		default:
			emmiter = new NavadsEmitter();
			break;
	}
	return emmiter;
};

