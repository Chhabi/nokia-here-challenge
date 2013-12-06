/*!
 * Route Controller 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x',
	'comp/route-list',
	'comp/options',
	'comp/panel'
], function(
	x,
	List,
	Options,
	Panel
) {

	var toolbarModel = {
		btns: [{
			label: '',
			iconClass: 'icon-automobile',
			action: 'transport',
			disabled: true
		}, {
			label: '',
			iconClass: 'icon-share',
			action: 'share',
			disabled: true
		}]
	};

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._root = document.createElement('div');
			this._root.classList.add('route-box');

			this._list = new List({
				template: 'route.list',
				model: { items: [] }
			});
			this._toolbar = new Options({
				template: 'route.toolbar',
				togglable: true,
				model: toolbarModel
			});

			this._transportSelector = new Options({
				template: 'route.transport-selector',
				model: {
					btns: [{
						label: '',
						iconClass: 'icon-automobile',
						action: 'car',
						selected: true
					}, {
						label: '',
						iconClass: 'icon-bus',
						action: 'publicTransport',
						selected: false
					}, {
						label: '',
						iconClass: 'icon-uniF56D',
						action: 'pedestrian',
						selected: false
					}]
				}
			});
			this._transportSelector.hide();

			this._sharePanel = new Panel({
				template: 'route.share',
				model: {
					label: 'Copy and share this link with your friends:',
					link: ''
				}
			});
			this._sharePanel.hide();

			this._list.on('btn:remove', this._onListItemRemove.bind(this));
			this._list.on('list:changed', this._onListChanged.bind(this));
			this._list.on('list:filled', this.show.bind(this));
			this._list.on('list:empty', this.hide.bind(this));

			this._toolbar.on('toggle:activate', this._onToggleActivated.bind(this));
			this._toolbar.on('toggle:deactivate', this._onToggleDeactivated.bind(this));

			this._transportSelector.on('toggle:activate', this._onTransportSelected.bind(this));

			this.hide();
			this.nodes.add(this._list.root);
			this.nodes.add(this._toolbar.root);
			this.nodes.add(this._transportSelector.root);
			this.nodes.add(this._sharePanel.root);
		},
		accessors: {
			list: {
				get: function() {
					return this._list.model.items;
				}
			}
		},
		show: function() {
			this._root.classList.remove('hidden');
		},
		hide: function() {
			this._root.classList.add('hidden');
		},
		add: function(item) {
			var model = this._list.model;
			model.items.push(item);
			this._list.model = model;
			if (model.items.length > 1) {
				toolbarModel.btns[0].disabled = false;
				toolbarModel.btns[1].disabled = false;
				this._toolbar.model = toolbarModel;
			}
		},
		remove: function(id) {
			var model = this._list.model;
			for (var i = 0, el; el = model.items[i]; i++) {
				if (el.placeId == id) {
					model.items.splice(i, 1);
					break;
				}
			}
			this._list.model = model;
			if (model.items.length < 2) {
				toolbarModel.btns[0].disabled = true;
				toolbarModel.btns[1].disabled = true;
				this._toolbar.model = toolbarModel;
				this._transportSelector.hide();
				this._sharePanel.hide();
			}
		},
		_onListItemRemove: function(item) {
			this.emit('item:remove', item);
		},
		_onTransportSelected: function(e) {
			this.emit('transport:changed', e.action);
		},
		_onToggleActivated: function(e) {
			if (e.action === 'transport') {
				this._transportSelector.show();
			} else {
				var id = null;
				x.data.fetch('/uuid')
				.then(function(data) {
					id = data.uuid;
					x.data.push('/share', {
						items: this.list,
						id: data.uuid
					}).then(function(data) {
						var model = this._sharePanel.model;
						var origin = window.location.origin;
						if (!origin) {
							origin = window.location.href.split('?')[0];
						}
						model.link = origin + '?shareid=' + id;
						this._sharePanel.model = model;
					}.bind(this));
				}.bind(this));
				this._sharePanel.show();
			}
		},
		_onToggleDeactivated: function(e) {
			if (e.action === 'transport') {
				this._transportSelector.hide();
			} else {
				this._sharePanel.hide();
			}
		},
		_onListChanged: function() {
			this.emit('list:changed');
		}
	});
});
