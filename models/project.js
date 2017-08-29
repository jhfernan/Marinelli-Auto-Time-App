'use strict';

const mongoose = require('mongoose');
const errHandler = require('../middleware/error_handler');

const projectSchema = mongoose.Schema({
	name: { type: String, required: true, lowercase: true, trim: true },
	created_at: { type: Date, default: Date.now }
	start: { type: Date },
	stop: { type: Date }

});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
