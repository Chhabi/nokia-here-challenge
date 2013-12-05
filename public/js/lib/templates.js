define([
	'lib/text!tpl/search/input.ect',
	'lib/text!tpl/search/list.ect',
	'lib/text!tpl/route/list.ect'
], function(
	searchInput,
	searchList,
	routeList
) {

	return {
		'search': {
			'input': searchInput,
			'list': searchList
		},
		'route': {
			'list': routeList
		}
	};
});
