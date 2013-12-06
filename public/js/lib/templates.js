define([
	'lib/text!tpl/search/input.ect',
	'lib/text!tpl/search/list.ect',
	'lib/text!tpl/route/list.ect',
	'lib/text!tpl/route/toolbar.ect',
	'lib/text!tpl/route/transport-selector.ect',
	'lib/text!tpl/route/share.ect'
], function(
	searchInput,
	searchList,
	routeList,
	routeToolbar,
	routeTransportSelector,
	routeShare
) {

	return {
		'search': {
			'input': searchInput,
			'list': searchList
		},
		'route': {
			'list': routeList,
			'toolbar': routeToolbar,
			'transport-selector': routeTransportSelector,
			'share': routeShare
		}
	};
});
