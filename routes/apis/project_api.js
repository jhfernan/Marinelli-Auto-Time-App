'use strict';

const express = require('express');
const router = express.Router();

const Project = require('../../models/project');
// const mid = require('../../middleware/application');
const projectPromises = require('../promises/project_promises');

/* All middleware required for routes*/
// Something to the effect requiring authorization

/* projects api ---------------------------------------------------------------- */
router.route('/projects')
.get((req, res) => {
	projectPromises.getAllProjects()
	.then(projects => {
		res.json(projects);
	})
	.catch(err => {
		res.status(err.status).send(err.message);
	});
})
.post((req, res) => {
	projectPromises.createProject(req.body)
	.then(data => {
		projectPromises.getAllProjects()
		.then(projects => {
			res.json(projects);
		});
	})
	.catch(err => {
		res.status(err.status).send(err.message);
	});
});

// router.route('/users/:user_id')
// .put(mid.mustBeAdminOrManager, (req, res) => {
// 	userPromises.updateUser(req.params.user_id, req.body)
// 	.then(data => {
// 		userPromises.getAllUsers().then(users => {
// 			res.json(users);
// 		});
// 	})
// 	.catch(err => {
// 		res.status(err.status).send(err.message);
// 	});
// })
// .delete(mid.mustBeAdmin, (req, res) => {
// 	userPromises.deleteUser(req.params.user_id)
// 	.then( data => {
// 		userPromises.getAllUsers().then(users => {
// 			res.json(users);
// 		});
// 	})
// 	.catch(err => {
// 		res.status(err.status).send(err.message);
// 	});
// });

module.exports = router;
