// src/utils/handlebarsHelpers.js
import Handlebars from 'handlebars';

Handlebars.registerHelper('or', function (a, b) {
  return a || b;
});