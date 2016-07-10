(function (){
  'use strict';


  angular.module('kt.components', [
    'kt.components.dropdown'
  ]);




  angular

    .module('kt.components.dropdown', [])


    .factory('ktDropdownSvc', [function () {
      var current = undefined;
      var dropdowns = [];
      var service = {};

      service.addDropdown = function (element, targets) {
        var dropdown = {
          element: element,
          targets: targets
        };
        dropdowns.push(dropdown);

        return dropdown;
      };

      service.removeDropdown = function (dropdown) {
        if (service.isOpen(dropdown)) {
          service.closeDropdown(dropdown);
        }
        var index = dropdowns.indexOf(dropdown);
        dropdowns.splice(index, 1);
      };

      service.openDropdown = function (dropdown) {
        service.closeCurrent();
        dropdown.targets.forEach(function (target) {
          service.openTarget(target);
        });
        dropdown.element.addClass('kt-dropdown-open');
        current = dropdown;
      };

      service.closeDropdown = function (dropdown) {
        dropdown.targets.forEach(function (target) {
          service.closeTarget(target);
        });
        dropdown.element.removeClass('kt-dropdown-open');
        current = undefined;
      };

      service.closeCurrent = function () {
        if (current) {
          service.closeDropdown(current);
        }
      };

      service.toggleDropdown = function (dropdown) {
        if (service.isOpen(dropdown)) {
          service.closeDropdown(dropdown);
        } else {
          service.openDropdown(dropdown);
        }
      };

      service.isCurrent = function (dropdown) {
        return current === dropdown;
      };

      service.initTarget = function (target) {
        service.closeTarget(target);
      };

      service.openTarget = function (target) {
        target.removeClass('kt-dropdown-target-closed');
        target.addClass('kt-dropdown-target-open');
      };

      service.closeTarget = function (target) {
        target.removeClass('kt-dropdown-target-open');
        target.addClass('kt-dropdown-target-closed');
      };

      service.isOpen = function (dropdown) {
        return dropdown.element.hasClass('kt-dropdown-open');
      };

      return service;
    }])


    .directive('ktDropdown', ['$timeout', 'ktDropdownSvc', function ($timeout, ktDropdownSvc) {
      function link(scope, element, attributes) {
        if (!attributes.ktDropdown) {
          return;
        }

        var dropdown = undefined;

        $timeout(function () {
          var targets = [];
          Array.prototype.slice.call(document.querySelectorAll(attributes.ktDropdown)).forEach(function (target) {
            var t = angular.element(target);
            ktDropdownSvc.closeTarget(t);
            targets.push(t);
          });
          dropdown = ktDropdownSvc.addDropdown(element, targets);
        });

        element.on('click', function () {
          if (!ktDropdownSvc.isCurrent(dropdown)) {
            ktDropdownSvc.openDropdown(dropdown);
          } else {
            ktDropdownSvc.toggleDropdown(dropdown);
          }
        });

        scope.$on('$destroy', function () {
          ktDropdownSvc.removeDropdown(dropdown);
        })
      }

      document.addEventListener('click', function (e) {
        e = e || window.event;
        var target = angular.element(e.target || e.srcElement);
        if (!target.attr('kt-dropdown') && !target.hasClass('kt-dropdown-target-open')) {
          ktDropdownSvc.closeCurrent();
        }
      }, false);

      return {
        restrict: 'A',
        link    : link
      };
    }]);

})();
