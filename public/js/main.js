requirejs.config({
	baseUrl: 'js',
	paths: {
		tpl: '../templates'
	}
});

requirejs([
	'ctrl/app'
], function(
	App
) {

	var app = new App();
	app.run();

});
