/*!
 * Panel 0.0.1
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
			if (x.device.isIE) {
				this._root.innerHTML = x.renderContent(this._template, this._model, true);
			}

		},

		show: function() {
			this._root.classList.remove('hidden');
		},
		hide: function() {
			this._root.classList.add('hidden');
		}
	});
});
