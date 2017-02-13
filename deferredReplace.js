angular.module('deferred')
	.directive('deferredReplace', function () {
		return {
			restrict: 'E',
			require: "^deferred",
			compile: function (element, attr) {
				var parent = element.parent();
				var replacee = parent.parent();
				replacee.after("<div ng-hide=$deferred." + parent.attr('name') + ">ready</div>");
				replacee.after("<div ng-show=$deferred." + parent.attr('name') + ".$$state.status==0>loading..</div>");
				replacee.after("<div ng-show=$deferred." + parent.attr('name') + ".$$state.status==2>error</div>");
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
