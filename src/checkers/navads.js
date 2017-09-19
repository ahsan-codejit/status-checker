'use strict';
// src/checkers/navads
const console = require('../lib/logger')('checker:navads');
const SubmissionStatus = require('../models/submissionStatus');
const ChannelStatus = require('../models/channelStatus');
// const ApiCaller = require('../services/apiCaller');
module.exports = class Navads {
	constructor(services){
		if(typeof services !== 'object' || typeof services.settings !== 'object'){
			throw new Error('services are required');
		}
		if(!services.dbConnection){
			throw new Error('Database connection is required');
		}
		if(!services.dbDataTypes){
			throw new Error('Sequelize data types object is required');
		}
		if(!services.idListCollector){
			throw new Error('Navads id list collector instance is required');
		}
		this.services = services;
		this.config = services.settings;
		// create model objects
		this.SubmissionStatus = SubmissionStatus(services.dbConnection, services.dbDataTypes);
		this.ChannelStatus = ChannelStatus(services.dbConnection, services.dbDataTypes);
		// id collector object
		this.idListCollector = services.idListCollector;
		this.idListToCheck = [];
		this.failedIdList = [];
		this.processCounter = 0;
	}

	start(){
		this.idListCollector
		.getList()
		.then(idList=>{
			if(!Array.isArray(idList) || idList.length<=0){
				this.services.emitter.emit('fail', 'Process has been stopped because of not availability of id list to check');
			}
			this.idListToCheck = idList.filter(row=> row && typeof row.id==='string')
			.map(row => row.id);
			
			this.processCounter = 0;
			(function checkRunner(id){
				this.check(id)
				.then(res=>{
					console.log(`Checking status is done for ${this.processCounter}:${this.idListToCheck[this.processCounter]}:${res}`);
					if(this.processCounter>=this.idListToCheck.length){
						this.services.emitter.emit('done', this.idListToCheck, this.failedIdList);
					} else {
						checkRunner.bind(this)(this.idListToCheck[this.processCounter++]);
					}
				}
			)}.bind(this))(this.idListToCheck[this.processCounter++]);
		})
		.catch(err=>{
			console.error(`Exception occured in start in navads: ${err}`);
			this.services.emitter.emit('exception', err);
		});
	}

	check(id){
		return this.getStatusDetails(id)
		.then(details=>{
			console.log(details);
			if(details){
				return this.saveSubmissionStatus(details)
				.then(res=>{
					return this.saveChannelStatus(details);
				})
				.catch(err=>{
					console.error(`saveSubmissionStatus fails for ${id}: ${err}`);
					return false;
				});
			} else {
				this.failedIdList.push(id);
				return false;
			}
		})
		.catch(err=>{
			this.failedIdList.push(id);
			console.error(`Exception occured in getStatusDetails: ${err}`);
			return false;
		});
	}

	getStatusDetails(id){
		if(!this.config.api || !this.config.api.url){
			throw new Error('Api url is required');
		}
		if(!this.config.api || !this.config.api.key){
			throw new Error('Api Key is required');
		}
		let options = {
			url: this.config.api.url+id,
			headers: {
				authorization: this.config.api.key
			}
		};
		return this.services.apiCaller.execute(options)
		.then(res=>{
			try{
				let details = JSON.parse(res);
				if(details && details.id && 
					details.originalDetails && typeof details.originalDetails==='object' && 
					details.channelStatuses && typeof details.channelStatuses==='object'){
					return details;

				} else {
					return false;
				}
			} catch(err){
				console.error(`Exception occured at processing response of navads details: ${err}`);
				return false;
			}
		})
		.catch(err=>{
			console.error(`ApiCaller gets error: ${err}`);
			return false;
		});
	}

	saveSubmissionStatus(details){
		// delete status
		return this.deleteSubmissionStatuse(details.id)
		.then(()=>{
			// create submission status 
			return this.SubmissionStatus.create({ 
				navads_id: details.id,
				group_id: details.groupId,
				navads_status: details.status,
				original_details: (typeof details.originalDetails==='object')?JSON.stringify(details.originalDetails):details.originalDetails,
				cleansed_details: (typeof details.cleansedDetails==='object')?JSON.stringify(details.cleansedDetails):details.cleansedDetails,
				inactivation_date: details.inactivationDate,
				first_cleanse_date: details.firstCleanseDate,
				last_cleanse_date: details.lastCleanseDate,
				created: details.created,
				updated: details.updated
			})
			.then(submissionStatus => {
				console.log(`saveSubmissionStatus for navads ${details.id} is: ${JSON.stringify(submissionStatus)}`);
				return submissionStatus;
			});
		});
	}

	saveChannelStatus(details){
		// delete status
		return this.deleteChannelStatuse(details.id)
		.then(()=>{
			// create channel status
			return details.publicationChannels.forEach(channel => {
				let channelInfo = details.channelStatuses[channel];
				this.ChannelStatus.create({ 
					navads_id: details.id,
					navads_directory_statuscol: details.status,
					directory: channel,
					submission_status: channelInfo.submissionDetails.status,
					first_submission_date: channelInfo.submissionDetails.firstSubmissionDate,
					last_submission_date: channelInfo.submissionDetails.lastSubmissionDate,
					publication_status: channelInfo.publicationDetails.status,
					fields_status: JSON.stringify(channelInfo.publicationDetails.fieldsStatus),
					published_since_date: channelInfo.publicationDetails.publishedSinceDate,
					last_crawl_date: channelInfo.publicationDetails.lastCrawlDate,
					deeplink: channelInfo.deepLink
				})
				.then(channelStatus => {
					console.log(`saveChannelStatus for navads ${details.id}: ${JSON.stringify(channelStatus)}`);
					return channelStatus;
				});
			});
				
		});
	}

	deleteSubmissionStatuse(id){
		return this.SubmissionStatus.destroy({
			where: {
				navads_id: id
			}
		})
		.then((affectedRows)=>{
			console.log(`Affected rows for deleteSubmissionStatuse of ${id} is ${affectedRows}`);
			if(affectedRows) {
				return true;
			} else {
				return false;
			} 
		})
		.catch(err=>{
			return false;
		});
	}

	deleteChannelStatuse(id){
		return this.ChannelStatus.destroy({
			where: {
				navads_id: id
			}
		})
		.then((affectedRows)=>{
			console.log(`Affected rows for deleteChannelStatuse of ${id} is ${affectedRows}`);
			if(affectedRows) {
				return true;
			} else {
				return false;
			}
		})
		.catch(err=>{
			return false;
		});
	}
};