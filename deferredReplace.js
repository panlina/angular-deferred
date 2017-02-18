angular.module('deferred')
	.directive('deferredReplace', function (deferredReplaceConfig) {
		return {
			restrict: 'E',
			require: "^deferred",
			compile: function (element, attr) {
				var parent = element.parent();
				var replacee = parent.parent();
				replacee.after(angular.element(deferredReplaceConfig.ready).attr('ng-hide', "$deferred." + parent.attr('name')));
				replacee.after(angular.element(deferredReplaceConfig.loading).attr('ng-show', "$deferred." + parent.attr('name') + ".$$state.status==0"));
				replacee.after(angular.element(deferredReplaceConfig.error).attr('ng-show', "$deferred." + parent.attr('name') + ".$$state.status==2"));
				return function (scope, element, attr, deferred) {
					replacee.addClass('ng-hide');
					scope.$watch(function () { return deferred.promise; }, function (value) {
						replacee.addClass('ng-hide');
						if (!value) return;
						deferred.promise
							.then(function (value) {
								replacee.removeClass('ng-hide');
							});
					})
				};
			}
		};
	})
	.provider('deferredReplaceConfig', function () {
		return {
			ready: "<div>ready</div>",
			loading: "<div>loading..</div>",
			error: "<div>error</div>",
			$get: function () { return this; }
		};
	})
