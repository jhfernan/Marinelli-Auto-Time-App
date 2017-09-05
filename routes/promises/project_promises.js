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

// const updateUser = (userId, bodyObject) => {
// 	return new Promise((resolve, reject) => {
// 		if (bodyObject.name.first && bodyObject.name.last && bodyObject.profile_name) {
// 			if (bodyObject.profile_name.length < 5) {
// 				reject(errHandler.createNewError(400, 'Profile name needs to be at least five characters long'))
// 			} else {
// 				User.findOneAndUpdate({_id: userId},
// 					{
// 						$set: {
// 							name: {
// 								first: bodyObject.name.first,
// 								mid: bodyObject.name.mid,
// 								last: bodyObject.name.last
// 							},
// 							profile_name: bodyObject.profile_name,
// 							admin: bodyObject.admin,
// 							manager: bodyObject.manager,
// 							employee: bodyObject.employee,
// 							client: bodyObject.client,
// 							updated_at: Date.now()
// 						}
// 					}, (err, user) => {
// 					if (err) {
// 						reject(errHandler.mongooseError(err));
// 					}
// 					resolve(user);
// 				});
// 			}
// 		} else {
// 			reject(errHandler.createNewError(400, 'First name, last name, email and profile name are required'))
// 		}
// 	});
// };
//
// const deleteUser = userId => {
// 	return new Promise((resolve, reject) => {
// 		User.remove({_id: userId}, (err, user) => {
// 			if (err) {
// 				reject(errHandler.mongooseError(err));
// 			}
// 			resolve(user);
// 		});
// 	});
// };

// const getUser = (userId) => {
// 	return new Promise((resolve, reject) => {
// 		User.findById(userId, function(err, user) {
// 			if (err) {
// 				reject(err);
// 			}
// 			resolve(user);
// 		})
// 	});
// };


module.exports.getAllProjects = getAllProjects;
module.exports.createProject = createProject;
// module.exports.updateUser = updateUser;
// module.exports.deleteUser = deleteUser;
