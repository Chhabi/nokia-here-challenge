// <pre>
//	NokiaHereChallenge  0.1.0

//	(c) 2013 Federico Giovagnoli (meesayen)
//	Nokia Here Challenge may be freely distributed under the MIT license.
// </pre>

define([
	'lib/x',
	'lib/templates',

	'ctrl/mapController',
	'ctrl/searchController',
	'ctrl/routeController'
], function(
	x,
	templates,

	MapController,
	SearchController,
	RouteController
) {

	x.setTemplates(templates);

	var STARTING_MAP_CENTER = [52.516274, 13.377678]; // Berlin

	return x.Class({
		parent: x.DomHandler,
		constructor: function() {
			this._root = x.query('#app');

			this._calculationDelay = null;

			this.mapCtrl = new MapController();
			this.searchCtrl = new SearchController();
			this.routeCtrl = new RouteController();

			this.searchCtrl.on('input:changed', this._onSearchInputChanged.bind(this));
			this.searchCtrl.on('item:add', this._onSearchItemAdd.bind(this));
			this.searchCtrl.on('item:remove', this._onSearchItemRemove.bind(this));

			this.routeCtrl.on('item:remove', this._onRouteItemRemove.bind(this));

			this.nodes.add(this.mapCtrl.root);
			this.mapCtrl.init(STARTING_MAP_CENTER);

			this.nodes.add(this.searchCtrl.root);
			this.nodes.add(this.routeCtrl.root);
		},
		run: function() {

		},
		_onSearchInputChanged: function(query) {
			if (query && query.length > 3) {
				nokia.places.search.manager.findPlaces({
					searchTerm: query,
					onComplete: this._onPlacesFetched.bind(this),
					searchCenter: this.mapCtrl.center
				});
			} else {
				this._placesList = [];
			}
		},
		_onSearchItemAdd: function(item) {
			this.routeCtrl.add(item);
			this._triggerRouteCalculationDelayed(3000);
		},
		_onSearchItemRemove: function(item) {
			this.routeCtrl.remove(item.placeId);
		},
		_onRouteItemRemove: function(item) {
			this.routeCtrl.remove(item.placeId);
			this._refreshSearchList();
			if (this.routeCtrl.list.model.length > 1) {
				this._triggerRouteCalculationDelayed(3000);
			} else {
				this.mapCtrl.clearRoute();
			}
		},
		_onPlacesFetched: function(data, status) {
			console.log(data,status);
			this._placesList = data.results.items.slice(0);
			this._refreshSearchList();
		},
		_refreshSearchList: function() {
			var
				routeList = this.routeCtrl.list.model,
				routeMap = {},
				list = this._placesList;

			if (list) {
				for (var i = 0, el; el = routeList[i]; i++) {
					routeMap[el.placeId] = true;
				}
				for (var i = 0, el; el = list[i]; i++) {
					el.inserted = routeMap[el.placeId];
				}
				this.searchCtrl.addAll(list);
			}
		},
		_triggerRouteCalculationDelayed: function(delay) {
			this._calculationDelay && clearTimeout(this._calculationDelay);
			this._calculationDelay = setTimeout(function() {
				this.mapCtrl.clearRoute();
				var list = this.routeCtrl.list.model;
				for (var i = 0, p; p = list[i]; i++) {
					this.mapCtrl.addWaypoint(p);
				}
				this.mapCtrl.calculateRoute();
			}.bind(this), delay);
		}
	});
});
