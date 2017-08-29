'use strict';

const Project = require('./models/project');

let seededData = [
	Project({
		name: 'Create App'
	})
];

for (let seedData of seededData) {
	seedData.save(function(err) {
		if (err) {
			console.error(err.message)
		};
		console.log('Data created!');
	});
}
