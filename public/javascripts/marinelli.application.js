var marinelliApp = angular.module('marinelliApp', ['ngAnimate']);

marinelliApp.controller('projectCtrl', function($rootScope, $scope, $http, projectService) {
	// For "flashing" messages we create the instance of the variable
	$rootScope.flashMessages = [];

	// Set Variables
	$scope.projects = {};
	$scope.project = {};

	// Start by getting all projects
	projectService.getProjects(function(data) {
		$scope.projects = data;
		$scope.setMainProject(0);
	}, function(data) {
		$rootScope.flashMessages.push({type: 'danger', title: 'Error', message: data});
	});

	// Set up project main
	$scope.setMainProject = function(index) {
		$scope.project = $scope.projects[index];
	};

	// Set forms data to blank
	$scope.addProjectForm = {};
	$scope.addNoteForm = {};
	// when submitting the add form, send the text to the node API
	$scope.createProject = function() {
		projectService.createProject($scope.addProjectForm, function(data) {
			$scope.addProjectForm = {};
			$scope.projects = data;
			$scope.setMainProject($scope.projects.length - 1);
			$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'Project created!'});
			$scope.addProjectModal = !$scope.addProjectModal;
		}, function(data) {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};

	// Save project Changes
	$scope.saveProjectEdits = function() {
		this.editing = false;
		projectService.updateProject($scope.project._id, $scope.project, function() {
			$scope.projects = data;
			$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'User has been updated!'});
		}, function() {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};

	// Delete a project
	$scope.deleteProject = function(id) {
		projectService.deleteProject(id, function(data) {
			$scope.projects = data;
			if ($scope.project._id == id) {
				$scope.setMainProject(0);
			}
			$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'Project has been deleted!'});
		}, function(data) {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};

	// Convert ISO Date string to working format
	$scope.formatToLocalDateTime = function(dateString, option = 0) {
		let date = new Date(dateString);
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		switch(option) {
			// Returns the date in a short format
			case 1:
				date = date.toLocaleDateString().replace(/\//g,'-');
				break;
			// Returns the date in a long format
			case 2:
				date = date.toLocaleDateString('en-US', options);
				break;
			// Use this case to return the local time of the date/time stamp
			case 3:
				date = date.toLocaleTimeString();
				break;
			default:
				date = date.toLocaleDateString();
		}

		return date
	};

	// Check whether we have a start time and update project times accordingly
	$scope.startStopTime = function(id) {
		let timesLength = $scope.project.times.length;
		let lastIndex = timesLength - 1;
		let timeData = $scope.project.times;
		if (timesLength == 0 || timeData[lastIndex].stop) {
			timeData.push({ start: Date.now() });
		} else {
			timeData[lastIndex].stop = Date.now();
		};

		projectService.setTimes(id, { times: timeData }, function(data) {
			$scope.projects = data;
		}, function(data) {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};

	// Check whether we have a start time and update project times accordingly
	$scope.startStopTimeWithNotes = function(id) {
		let timesLength = $scope.project.times.length;
		let lastIndex = timesLength - 1;
		let timeData = $scope.project.times;
		if (timesLength == 0 || timeData[lastIndex].stop) {
			timeData.push({
				start: Date.now()
			});
		} else {
			timeData[lastIndex].stop = Date.now();
		};

		projectService.setTimes(id, { times: timeData }, function(data) {
			$scope.projects = data;
			$scope.addNoteModal = !$scope.addNoteModal;
		}, function(data) {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};

	// total hours
	$scope.getTotalHoursSpent = function(start, stop) {
		let dateOne = new Date(start);
		let dateTwo = new Date(stop);
		let diff = (dateTwo - dateOne)/1000/60/60;
		diff = diff.toFixed(2);
		return diff
	};

	// checkForClass()
	$scope.checkForClass = function() {
		if ($scope.project.times.length == 0 || $scope.project.times[$scope.project.times.length - 1].stop) {
			return true;
		} else {
			return false;
		};
	};
	// Change name with start and stop
	$scope.startingOrStoppingName = function() {
		if ($scope.project.times.length == 0 || $scope.project.times[$scope.project.times.length - 1].stop) {
			return 'Start';
		} else {
			return 'Stop';
		};
	};

	// returnTotalTime
	$scope.returnTotalTime = function() {
		let totalHours = 0;
		if ($scope.project.times.length == 0) {
			return '';
		} else {
			for (let i = 0; $scope.project.times.length > i; i++) {
				if ($scope.project.times[i].stop) {
					let dateOne = new Date($scope.project.times[i].start);
					let dateTwo = new Date($scope.project.times[i].stop);
					let diff = (dateTwo - dateOne)/1000/60/60;
					totalHours += diff;
				};

				if (totalHours == 0) {
					return '';
				} else {
					return totalHours.toFixed(2);
				}
			}
		};
	};
});

marinelliApp.service('projectService', function($http) {
	// Get all projects
	this.getProjects = function(successCallback, errorCallback) {
		$http.get('/api/projects')
		.success(successCallback)
		.error(errorCallback);
	};

	// Create a project
	this.createProject = function(projectData, successCallback, errorCallback) {
		$http.post('/api/projects', projectData)
		.success(successCallback)
		.error(errorCallback);
	};

	// Start timer
	this.setTimes = function(projectId, timeData, successCallback, errorCallback) {
		$http.put('/api/projects/' + projectId + '/settimes', timeData)
		.success(successCallback)
		.error(errorCallback);
	};

	// Update user
	this.updateProject = function(projectId, project, successCallback, errorCallback) {
		$http.put('/api/projects/' + projectId, project)
		.success(successCallback)
		.error(errorCallback);
	};

	// Delete a project
	this.deleteProject = function(projectId, successCallback, errorCallback) {
		$http.delete('/api/projects/' + projectId)
		.success(successCallback)
		.error(errorCallback);
	}
});

marinelliApp.directive('flashMsgs', function() {
	return {
		template: '<div role="alert" class="alert alert-{{ flashMessage.type }} fade">' +
		'<p class="mb-0"><strong>{{ flashMessage.title }}:</strong> {{ flashMessage.message }}' +
		'</p></div>',
		restrict: 'E',
		link: function($rootScope, scope, element, attributes) {
			$rootScope.$watch('flashMessages', function(val) {
				if (val.length) {
					flashAMessage();
				}
			}, true);

			const flashAMessage = function() {
				$('.alert').addClass('show').delay(3000).queue(function(next) {
					$(this).removeClass('show').remove();
					$rootScope.flashMessages.splice(0);
					next();
				})
			}
		}
	};
});

marinelliApp.directive('markdown', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngModel, function(value, oldValue) {
				var markdown = value;
				var html = md.toHtml(markdown);
				element.html(html);
				setCodeHeader();
			});
		}
	};
});
