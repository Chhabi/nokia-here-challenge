/*!
 * Search Controller 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x',
	'comp/input',
	'comp/search-list'
], function(
	x,
	Input,
	List
) {

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._root = document.createElement('div');
			this._root.classList.add('search-box');

			var input = new Input({
				template: 'search.input'
			});
			this.list = new List({
				template: 'search.list'
			});

			input.on('input:changed', this._onInputChanged.bind(this));
			this.list.on('btn:add', this._onListItemAdd.bind(this));
			this.list.on('btn:remove', this._onListItemRemove.bind(this));

			this.nodes.add(input.root);
			this.nodes.add(this.list.root);
		},
		addAll: function(list) {
			this.list.model = list;
		},
		_onInputChanged: function(query) {
			if (query === '') {
				this.list.model = [];
				this.emit('input:changed', null);
			} else {
				this.emit('input:changed', query);
			}
		},
		_onListItemAdd: function(item) {
			this.emit('item:add', this.list.model[item.idx]);
		},
		_onListItemRemove: function(item) {
			this.emit('item:remove', this.list.model[item.idx]);
		}
	});
});
