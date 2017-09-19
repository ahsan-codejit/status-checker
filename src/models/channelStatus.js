'use strict';
// const console = require('../lib/logger')('checker:model:CheckerStatus');
module.exports = function(dbConnector, DataTypes) {
	let CheckerStatus = dbConnector.define('CheckerStatus', {
		id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
		navads_id: {type: DataTypes.STRING(50), allowNull: false},
		navads_directory_statuscol: {type: DataTypes.STRING(45), allowNull: true},
		directory: {type: DataTypes.STRING(45), allowNull: false },
		submission_status: {type: DataTypes.STRING(45), allowNull: true},
		first_submission_date: {type: DataTypes.DATE, allowNull: true},
		last_submission_date: {type: DataTypes.DATE, allowNull: true},
		publication_status: {type: DataTypes.STRING(45), allowNull: true},
		fields_status: {type: DataTypes.TEXT, allowNull: true},
		published_since_date: {type: DataTypes.DATE, allowNull: true},
		last_crawl_date: {type: DataTypes.DATE, allowNull: true},
		deeplink: {type: DataTypes.STRING(255), allowNull: true},
		created_on: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
	},
	{
		timestamps: false,
		tableName: 'navads_channel_status',
		indexes: [{
			name: 'ncs_unique',
			fields: [{attribute: 'navads_id', order: 'ASC'}, {attribute: 'directory', order: 'ASC'}]
		}]
	});
	// CheckerStatus.sync()
	// .then(()=>{
	// 	console.log(`CheckerStatus has been sync`);
	// })
	// .catch(err=>{
	// 	console.error(`CheckerStatus has been sync ${err}`);
	// });
	return CheckerStatus;
};