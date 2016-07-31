(function () {
  'use strict';

  angular.module('kt.util', []);

  var domUtil = angular.module('kt.util.dom', []);

  domUtil.factory('ktDomTree', [function () {
    var service = {};

    function findParentByTag(element, tag) {
      while (element.parentNode) {
        element = element.parentNode;
        if (element.tagName === tag)
          return element;
      }
      return null;
    }

    function findParentByClass(element, className) {
      while (element.parentNode) {
        element = element.parentNode;
        if ((' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1) {
          return element;
        }
      }
      return null;
    }

    service.closest = function (element, selector) {
      switch (selector.charAt(0)) {
        case '.': return findParentByClass(element, selector.substring(1));
        default: return findParentByTag(element, selector.toUpperCase());
      }
    };

    return service;
  }]);

  domUtil.factory('ktOffset', ['ktDimensions', function (ktDimensions) {
    var service = {};

    service.offset = function (element) {
      var box = element.getBoundingClientRect();

      var body = document.body;
      var docElement = document.documentElement;

      var scrollTop = window.pageYOffset || docElement.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElement.scrollLeft || body.scrollLeft;

      var clientTop = docElement.clientTop || body.clientTop || 0;
      var clientLeft = docElement.clientLeft || body.clientLeft || 0;

      return {
        top : Math.round(box.top + scrollTop - clientTop),
        left: Math.round(box.left + scrollLeft - clientLeft)
      };
    };

    service.boundingRectangle = function (element) {
      var offset = service.offset(element);
      var width = ktDimensions.outerWidth(element);
      var height = ktDimensions.outerHeight(element);

      return {
        left  : offset.left,
        right : offset.left + width,
        top   : offset.top,
        bottom: offset.top + height
      };
    };

    return service;
  }]);

  domUtil.factory('ktDimensions', [function () {
    var service = {};

    service.outerWidth = function (element, includeMargin) {
      if (!includeMargin) {
        return element.offsetWidth;
      }

      var width = element.offsetWidth;
      var style = getComputedStyle(element);

      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
      return width;
    };

    service.outerHeight = function (element, includeMargin) {
      if (!includeMargin) {
        return element.offsetHeight;
      }

      var height = element.offsetHeight;
      var style = getComputedStyle(element);

      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
      return height;
    };

    return service;
  }]);
})();
