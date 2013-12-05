
/**
 * Module dependencies.
 */

var
	express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	ECT = require('ect');

var ectRenderer = ECT({
	watch: true,
	ext: '.ect',
	root: __dirname + '/views'
});
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
