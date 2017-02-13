angular.module('deferred', [])
	.directive('deferredVar', function (deferredConfig) {
		return {
			restrict: 'E',
			compile: function (element, attr) {
				element.children().attr('deferred.ctor', '');
				return {
					pre: function (scope, element, attr) {
						scope.$deferred = scope.$deferred || scope.$new();
						scope.$deferred.$var = {};
						scope.$deferred.start = function (name) {
							var element = scope.$deferred.$var[name];
							var type = deferredConfig.type[element[0].tagName.toLowerCase()];
							var promise = type(element);
							var promise = promise.then(function (value) {
								scope[name] = value;
								return value;
							});
							scope.$deferred[name] = promise;
						};
						scope.$deferred.reset = function (name) {
							scope.$deferred[name] = undefined;
						};
					}
				};
			}
		};
	})
	.directive('deferred.ctor', function (deferredConfig) {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				scope.$deferred.$var[attr.name] = element;
			}
		}
	})
	.directive('deferred', function () {
		return {
			controller: function ($scope, $element, $attrs) {
				var controller = {};
				Object.defineProperty(controller, 'promise', {
					get: function () { return $scope.$deferred[$attrs.name]; }
				});
				Object.defineProperty(controller, 'name', {
					get: function () { return $attrs.name; }
				});
				return controller;
			}
		};
	})
	.service('deferredConfig', function ($injector) {
		return {
			type: {}
		};
	})
	.decorator('deferredConfig',function ($delegate, $injector) {
		$delegate.type.http = $injector.invoke(function ($http) {
			return function (element) {
				return $http.get(element.attr('url'))
					.then(function (response) { return response.data; });
			};
		});
		$delegate.type.timeout = $injector.invoke(function ($timeout) {
			return function (element) {
				var value = element.attr('value');
				var interval = element.attr('interval');
				return $timeout(function () { return value; }, interval);
			};
		});
		return $delegate;
	})
