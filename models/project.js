'use strict';

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	name: { type: String, required: true, trim: true },
	notes: { type: String, default: "" },
	createdAt: { type: Date, default: Date.now },
	times: [{
		_id : false,
		start: Date,
		stop: Date,
		diff: Number,
		notes: { type: String, default: "" }
	}]

});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
