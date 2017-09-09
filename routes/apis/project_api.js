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

// Starting and stopping api
router.route('/projects/:project_id/settimes')
.put((req, res) => {
	projectPromises.punchTimeClock(req.params.project_id, req.body)
	.then(data => {
		projectPromises.getAllProjects()
		.then(projects => {
			res.json(projects);
		});
	});
});

router.route('/projects/:project_id')
.put((req, res) => {
	projectPromises.updateProject(req.params.project_id, req.body)
	.then(data => {
		projectPromises.getAllProjects()
		.then(projects => {
			res.json(projects);
		});
	})
	.catch(err => {
		res.status(err.status).send(err.message);
	});
})
.delete((req, res) => {
	projectPromises.deleteProject(req.params.project_id)
	.then( data => {
		projectPromises.getAllProjects()
		.then(projects => {
			res.json(projects);
		});
	})
	.catch(err => {
		res.status(err.status).send(err.message);
	});
});

module.exports = router;
