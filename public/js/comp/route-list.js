/*!
 * Route List 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x',
	'comp/list'
], function(
	x,
	List
) {

	return x.Class({
		parent: List,
		constructor: function(o) {
			List.apply(this, Array.prototype.slice.call(arguments, 0));
			this._root.addEventListener('dragstart', this._onDragStart.bind(this));
			this._boundDragEnd = this._onDragEnd.bind(this);
			this._boundDrop = this._onDrop.bind(this);
		},
		refresh: function() {
			List.prototype.refresh.apply(this, Array.prototype.slice.call(arguments, 0));
			if (this._model.length) {
				this.emit('list:filled');
			} else {
				this.emit('list:empty');
			}
		},
		_onListClick: function(e) {
			var el = e.srcElement || e.target;

			if (el.classList.contains('btn')) {
				this.emit('btn:remove', el.dataset);
			}
		},
		_onDragStart: function(e) {
			var el = e.srcElement || e.target;
			if (el.getAttribute('draggable') == 'true') {
				el.addEventListener('dragend', this._boundDragEnd);
				el.addEventListener('dragend', this._boundDrop);
			}
		},
		_onDrop: function(e) {
			e.preventDefault();
		},
		_onDragEnd: function(e) {
			var el = e.srcElement || e.target;
			el.removeEventListener('dragend', this._boundDragEnd);
		}
	});
});
