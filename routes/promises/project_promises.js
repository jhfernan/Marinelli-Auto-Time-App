'use strict';

const Promise = require('bluebird');
const errHandler = require('../../middleware/error_handler');
const Project = require('../../models/project');

const getAllProjects = () => {
	return new Promise((resolve, reject) => {
		Project.find({}, null, {sort: {created_at: 1}}, (err, projects) => {
			if (err) {
				reject(errHandler.createNewError(404, 'Projects not found'));
			}
			resolve(projects);
		});
	});
};

const createProject = bodyObject => {
	return new Promise((resolve, reject) => {
		if (bodyObject.name) {
			Project.create(bodyObject, (err, project) => {
				if (err) {
					reject(errHandler.mongooseError(err));
				}
				resolve(project);
			});
		} else {
			reject(errHandler.createNewError(400, 'The name for the project is required!'));
		}
	});
};

const punchTimeClock = (projectId, bodyObject) => {
	return new Promise((resolve, reject) => {
		Project.findOneAndUpdate({_id: projectId},
			{
				$set: { times: bodyObject.times }
			}, (err, project) => {
			if (err) {
				reject(errHandler.mongooseError(err));
			}
			resolve(project);
		});
	});
};

const updateProject = (projectId, bodyObject) => {
	return new Promise((resolve, reject) => {
		Project.findOneAndUpdate({_id: projectId},
			{
				$set: {
					name: bodyObject.name,
					notes: bodyObject.notes,
					times: bodyObject.times
				}
			}, (err, project) => {
			if (err) {
				reject(errHandler.mongooseError(err));
			}
			resolve(project);
		});
	});
};

const deleteProject = projectId => {
	return new Promise((resolve, reject) => {
		Project.remove({_id: projectId}, (err, project) => {
			if (err) {
				reject(errHandler.mongooseError(err));
			}
			resolve(project);
		});
	});
};


module.exports.getAllProjects = getAllProjects;
module.exports.createProject = createProject;
module.exports.punchTimeClock = punchTimeClock;
module.exports.updateProject = updateProject;
module.exports.deleteProject = deleteProject;
