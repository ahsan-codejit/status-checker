const console = require('../lib/logger')('model:SubmissionStatus');
module.exports = function(dbConnector, DataTypes) {
	let SubmissionStatus = dbConnector.define('SubmissionStatus', {
		id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
		navads_id: {type: DataTypes.STRING(50), allowNull: false},
		group_id: {type: DataTypes.STRING(30), allowNull: true},
		navads_status: {type: DataTypes.STRING(50), allowNull: true},
		original_details: {type: DataTypes.TEXT, allowNull: true},
		cleansed_details: {type: DataTypes.TEXT, allowNull: true},
		inactivation_date: {type: DataTypes.DATE, allowNull: true},
		first_cleanse_date: {type: DataTypes.DATE, allowNull: true},
		last_cleanse_date: {type: DataTypes.DATE, allowNull: true},
		created: {type: DataTypes.DATE, allowNull: true },
		updated: {type: DataTypes.DATE, allowNull: true },
		created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW },
	}, {
		timestamps: false,
		tableName: 'navads_submission_status',
		indexes: [{
			name: 'navads_id_UNIQUE',
			fields: [{attribute: 'navads_id', order: 'ASC'}]
		}]
	});
	// SubmissionStatus.sync()
	// .then(()=>{
	// 	console.log(`SubmissionStatus has been synced`);
	// });
	return SubmissionStatus;
};
