
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

	var HERE_APP_ID = 'pFfdbfGYQxFGxEYdd9Qu';
	var HERE_APP_CODE = 'LCflQuANiU98UgF-jH0zzA';

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._root = document.createElement('div');
			this._root.id = 'map';
			this._routeOnMap = false;

			nokia.Settings.set("app_id", HERE_APP_ID);
			nokia.Settings.set("app_code", HERE_APP_CODE);

			this._router = new nokia.maps.routing.Manager();
			this._waypoints = new nokia.maps.routing.WaypointParameterList();
			this.modes = [{
				type: "shortest",
				transportModes: ["car"],
				options: "avoidTollroad",
				trafficMode: "default"
			}];

			this._router.addObserver('state', this._onRouteCalculated.bind(this));
		},
		accessors: {
			center: {
				get: function() {
					return this._map.center
				}
			},
			transportMode: {
				get: function() {
					return this.modes.transportModes;
				},
				set: function(mode) {
					this.modes[0].transportModes = [];
					this.modes[0].transportModes.push(mode);
					if (this._routeOnMap) {
						this._map.objects.clear();
						this.calculateRoute();
					}
				}
			}
		},
		init: function(center) {
			this._map = new nokia.maps.map.Display(
				this._root, {
					components: [new nokia.maps.map.component.Behavior()],
					zoomLevel: 10,
					center: center
				}
			);
		},
		clearRoute: function() {
			this._waypoints.clear();
			this._map.objects.clear();
			this._routeOnMap = false;
		},
		addWaypoint: function(place) {
			this._waypoints.addCoordinate(
				new nokia.maps.geo.Coordinate(place.position.latitude, place.position.longitude)
			);
		},
		calculateRoute: function() {
			if (this._waypoints.size() > 1) {
				this._router.calculateRoute(this._waypoints, this.modes);
			}
		},
		_onRouteCalculated: function(observedRouter, key, value) {
			if (value == 'finished') {
				var routes = observedRouter.getRoutes();
				var mapRoute = new nokia.maps.routing.component.RouteResultSet(routes[0]).container;
				this._map.objects.add(mapRoute);
				this._map.zoomTo(mapRoute.getBoundingBox(), false, 'default');
				this._routeOnMap = true;
			} else if (value == 'failed') {
				console.error('The routing request failed.');
			}
		}
	});
});
