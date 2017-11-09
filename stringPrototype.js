"use strict";

module.exports = () => {
  String.prototype.contains = function(content) {
    return this.indexOf(content) !== -1;
  };

  String.prototype.endsWith = function(searchString, position) {
    const subjectString = this.toString();

    if (position === undefined || position > subjectString.length) {
      position = subjectString.length;
    }

    position -= searchString.length;
    const lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
};