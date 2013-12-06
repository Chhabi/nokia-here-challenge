/*!
 * Search Input 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x'
], function(
	x
) {

	var
		BTN_ERASE = 'btn erase icon-cross',
		BTN_SEARCH = 'btn search icon-search';

	return x.Class({
		parent: x.DomHandler,
		constructor: function(o) {
			this._template = o.template;
			this._model = o.model || [];
			this._root = x.render(this._template, this._model);
			if (x.device.isIE) {
				this._root.innerHTML = x.renderContent(this._template, this._model, true);
			}

			this._searchDelay = null;

			var input = this.nodes.one('input');
			input.addEventListener('keyup', this._onInputKeyUp.bind(this));
			var btn = this.nodes.one('.btn');
			btn.addEventListener('click', this._onBtnClick.bind(this));
		},
		_onInputKeyUp: function(e) {
			var el = e.srcElement || e.target;
			if (el.value != '') {
				this.nodes.one('.btn').className = BTN_ERASE;
				this._triggerSearchWithDelay(1500);
			} else {
				this.nodes.one('.btn').className = BTN_SEARCH;
				this._triggerSearchWithDelay(0);
			}
		},
		_onBtnClick: function(e) {
			var el = e.srcElement || e.target;
			var input = this.nodes.one('input');
			if (el.classList.contains('erase')) {
				input.value = '';
				el.className = BTN_SEARCH;
				this._searchDelay && clearTimeout(this._searchDelay);
				this.emit('input:changed', this.nodes.one('input').value);
			}
			input.focus();
		},
		_triggerSearchWithDelay: function(delay) {
			this._searchDelay && clearTimeout(this._searchDelay);
			this._searchDelay = setTimeout(function() {
				this.emit('input:changed', this.nodes.one('input').value);
			}.bind(this), delay);
		}
	});
});
