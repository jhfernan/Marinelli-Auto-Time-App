var marinelliApp = angular.module('marinelliApp', ['ngAnimate']);

marinelliApp.controller('projectCtrl', function($rootScope, $scope, $http, projectService) {
	// For "flashing" messages we create the instance of the variable
	$rootScope.flashMessages = [];

	// Start by getting all projects
	projectService.getProjects(function(data) {
		$scope.projects = data;
	}, function(data) {
		$rootScope.flashMessages.push({type: 'danger', title: 'Error', message: data});
	});

	// // Clear form button
	// // $scope.clearForm = function() {
	// // 	$scope.formData = {};
	// // };

	// Set our form data to blank
	$scope.addProjectForm = {};
	// when submitting the add form, send the text to the node API
	$scope.createProject = function() {
		projectService.createProject($scope.addProjectForm, function(data) {
			$scope.addProjectForm = {};
			$scope.projects = data;
			$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'Project created!'});
			$scope.addProjectModal = !$scope.addProjectModal;
		}, function(data) {
			$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
		});
	};
	//
	// // Set current user to editUser
	// $scope.currentEditUser = -1;
	// // Initialize form
	// $scope.editForm = {};
	// // Set Edit user for form
	// $scope.setNewEditUser = function(index) {
	// 	$scope.currentEditUser = index;
	// 	$scope.editForm = $scope.users[index];
	// 	$scope.editUserModal = !$scope.editUserModal;
	// };
	//
	// // Update a user
	// $scope.updateUser = function(id) {
	// 	userService.updateUser(id, $scope.editForm, function(data) {
	// 		$scope.users = data;
	// 		$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'User has been updated!'});
	// 		$scope.editUserModal = !$scope.editUserModal;
	// 	}, function(data) {
	// 		$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
	// 	});
	// };
	//
	// // Set current user to be deleted
	// $scope.currentDeleteUser = -1;
	// $scope.setNewDeleteUser = function(index) {
	// 	$scope.currentDeleteUser = index;
	// 	$scope.deleteUserModal = !$scope.deleteUserModal;
	// };
	//
	// // Delete a user
	// $scope.deleteUser = function(id) {
	// 	userService.deleteUser(id, function(data) {
	// 		$scope.users = data;
	// 		$scope.deleteUserModal = !$scope.deleteUserModal;
	// 		$rootScope.flashMessages.push({type: 'success', title: 'Success', message: 'User has been deleted!'});
	// 	}, function(data) {
	// 		$rootScope.flashMessages.push({type: 'warning', title: 'Error', message: data});
	// 	});
	// };
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

	// // Update user
	// this.updateUser = function(userId, user, successCallback, errorCallback) {
	// 	$http.put('/api/users/' + userId, user)
	// 	.success(successCallback)
	// 	.error(errorCallback);
	// };
	//
	// // Delete a user
	// this.deleteUser = function(userId, successCallback, errorCallback) {
	// 	$http.delete('/api/users/' + userId)
	// 	.success(successCallback)
	// 	.error(errorCallback);
	// }
	//
	// // // Get a user
	// // this.getUser = function(userId, successCallback, errorCallback) {
	// // 	$http.get('/api/user/' + userId)
	// // 	.success(successCallback)
	// // 	.error(errorCallback);
	// // };
	// //
	// // // Get an author
	// // this.getAuthor = function(userId, successCallback, errorCallback) {
	// // 	$http.get('/api/user/author.' + userId)
	// // 	.success(successCallback)
	// // 	.error(errorCallback);
	// // };
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
