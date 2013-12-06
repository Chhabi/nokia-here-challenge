/*!
 * Options 0.0.1
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
			this._togglable = o.togglable || false;
			this._root = x.render(this._template, this._model);
			if (x.device.isIE) {
				this._root.innerHTML = x.renderContent(this._template, this._model, true);
			}

			this._selectedAction = null;

			this._root.addEventListener('click', this._onToggleClick.bind(this));
		},

		show: function() {
			this._root.classList.remove('hidden');
		},
		hide: function() {
			this._root.classList.add('hidden');
		},

		refresh: function() {
			if (this._selectedAction) {
				var el = this.nodes.one('[data-action="' + this._selectedAction + '"]');
				el.classList.add('selected');
				this.emit('toggle:activate', el.dataset);
			}
		},

		_onToggleClick: function(e) {
			var
				selected = this.nodes.one('.selected'),
				el = e.srcElement || e.target;

			if (el.classList.contains('disabled')) {
				return;
			}

			if (selected == el && this._togglable) {
				if (el.classList.contains('selected')) {
					el.classList.remove('selected');
					this.emit('toggle:deactivate', el.dataset);
					this._selectedAction = null;
				} else {
					el.classList.add('selected');
					this._selectedAction = el.dataset.action;
					this.emit('toggle:activate', el.dataset);
				}
			} else {
				if (selected) {
					selected.classList.remove('selected');
					this.emit('toggle:deactivate', selected.dataset);
				}
				el.classList.add('selected');
				this._selectedAction = el.dataset.action;
				this.emit('toggle:activate', el.dataset);
			}
		}

	});
});
