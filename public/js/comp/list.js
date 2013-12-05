/*!
 * List 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x'
], function(
	x
) {

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._template = o.template;
			this._model = o.model || [];
			this._root = x.render(this._template, this._model);

			this._root.addEventListener('click', this._onListClick.bind(this));
		},

		_onListClick: function(e) {}

	});
});
