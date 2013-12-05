/*!
 * Route Controller 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x',
	'comp/route-list'
], function(
	x,
	List
) {

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._root = document.createElement('div');
			this._root.classList.add('route-box');

			this.list = new List({
				template: 'route.list'
			});

			this.list.on('btn:remove', this._onListItemRemove.bind(this));
			this.list.on('list:filled', this.show.bind(this));
			this.list.on('list:empty', this.hide.bind(this));

			this.hide();
			this.nodes.add(this.list.root);
		},
		show: function() {
			this._root.classList.remove('hidden');
		},
		hide: function() {
			this._root.classList.add('hidden');
		},
		_onListItemRemove: function(item) {
			this.emit('item:remove', item);
		},
		add: function(item) {
			var list = this.list.model;
			list.push(item);
			this.list.model = list;
		},
		remove: function(id) {
			var list = this.list.model;
			for (var i = 0, el; el = list[i]; i++) {
				if (el.placeId == id) {
					list.splice(i, 1);
					break;
				}
			}
			this.list.model = list;
		}
	});
});
