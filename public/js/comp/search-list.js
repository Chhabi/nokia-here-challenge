/*!
 * Search List 0.0.1
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

	var
		BTN_ADD = 'btn add icon-add-to-list',
		BTN_REMOVE = 'btn remove icon-minus';

	return x.Class({
		parent: List,
		constructor: function(o) {
			List.apply(this, Array.prototype.slice.call(arguments, 0));
		},

		_onListClick: function(e) {
			var el = e.srcElement || e.target;

			if (el.classList.contains('btn')) {
				if (el.dataset.action === 'remove') {
					el.className = BTN_ADD;
					el.dataset.action = 'add';
					this.emit('btn:remove', el.dataset);
				} else {
					el.className = BTN_REMOVE;
					el.dataset.action = 'remove';
					this.emit('btn:add', el.dataset);
				}
			}
		}

	});
});
